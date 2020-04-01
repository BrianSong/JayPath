const Joi = require("joi");
const express = require("express");
const app = express();
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const schedule = require("./schedule");
const filter = require("./filter");

app.use(express.json());
app.use(cors());

let courseInfo = [];
let courseName = [];

initilization();

// let courses = [];  // all the candidate courses (ready to be chosen if no time conflict)
let courseStatus = [];
for (var id_loop = 0; id_loop <= 25; id_loop++) {
  courseStatus[id_loop] = 0; // initialize all course status to 0 
}
// let course_to_id = new Map();
// for (var id_loop = 0; id_loop <= 25; id_loop++) {
//   courseStatus.set(id_loop, 0); // initialize all course status to 0 
// }

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

app.get("/api/courses", (req, res) => {


  let db = new sqlite3.Database("../db/JayPath.db", err => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the courses database.");
  });
  let currCourse = [];
  // Extract course according to the focus area and sent it back to the front end for displaying.
  let sql = `SELECT * FROM courses;`;

  db.all(sql, (err, allCourses) => {
    if (err) {
      return console.error(err.message);
    }
    allCourses.forEach((allCourse) => { currCourse.push(allCourse); })
  });

  // Close database
  db.close(err => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the courses connection.");
    res.send(currCourse);  // send the result to frontend
  });

});

app.get("/api/test", (req, res) => {
  res.send("Test API is Working!");
});

app.get("/api/:field/courses", (req, res) => {
  // send candidate courses to backend
  let courses = []
  field = String(req.params.field);

  // courses = filter.filterByPre(courseStatus, field, schedule.testConflict);

  // Open and connect to database
  let db = new sqlite3.Database("../db/JayPath.db", err => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the courses database.");
  });

  // Extract course according to the focus area and sent it back to the front end for displaying.
  let sql = `SELECT * FROM courses WHERE Track = ?;`;

  db.all(sql, [field], (err, allcourse) => {
    if (err) {
      throw err;
    }
    allcourse.forEach(course => {
      // check coursestcoursestatusatus, its prerequisite
      if (courseStatus[course.id] == 0) {  // not taken yet
        let pre_original = course.Prerequisite;
        let pre = pre_original.toString().split("-");
        let fulfill_flag = 1;
        for (var i = 0; i < pre.length; i++) {
          if (courseStatus[pre[i]] == 0) {
            fulfill_flag = 0;  // not fulfill the prerequisite
            break;
          }
        }
        if (fulfill_flag == 1) {
          courses.push(course);  // add a course to courses
        }
      }
    });
  });

  let sql_1 = `SELECT * FROM courses WHERE Track = ?;`;
  db.all(sql_1, ["core"], (err, allcourse) => {
    if (err) {
      throw err;
    }
    allcourse.forEach(course => {
      // check coursestatus, its prerequisite
      if (courseStatus[course.id] == 0) {  // not taken yet
        let pre_original = course.Prerequisite;
        // console.log(pre_original);

        let pre = pre_original.toString().split("-");
        let fulfill_flag = 1;
        for (var i = 0; i < pre.length; i++) {
          if (courseStatus[pre[i]] == 0) {
            fulfill_flag = 0;  // not fulfill the prerequisite
            break;
          }
        }
        if (fulfill_flag == 1) {
          courses.push(course);  // add a course to courses
        }
      }
    });
    // console.log(courses);
    courses = schedule.testConflict(courses);
  });


  // Close database
  db.close(err => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the courses connection.");
    res.send(courses);  // send the result to frontend
  });
});

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body); //object destructuring
  if (error) {
    // 400 Bad Request
    res.status(400).send(error.details[0].message);
    return;
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  //Lookup Course
  const course = courses.find(c => c.id == parseInt(req.params.id));

  if (!course) {
    res.status(404).send("Course not found");
  }

  //const result = validateCourse(req.body);
  const result = validateCourse(req.body); //object destructuring
  if (result.error) {
    // 400 Bad Request
    res.status(400).send(result.error.details[0].message);
    return;
  }

  course.name = req.body.name;
  res.send(course);
});

// /api/courses/1

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id == parseInt(req.params.id));
  if (!course) {
    res.status(404).send("Course not found");
  } //404
  res.send(course);
});

app.post("/api/user_info", (req, res) => {

  courses_to_add = req.body;
  //console.log(courses_to_add[1].trim());
  // Open and connect to data[1base
  let db = new sqlite3.Database("../db/JayPath.db", err => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the courses database.");
  });

  // Extract course according to the focus area and sent it back to the front end for displaying.
  let sql = `SELECT * FROM courses WHERE CourseTitle = ?;`;
  for (var i = 0; i < courses_to_add.length; i++) {
    // console.log(courses_to_add[i]);
    db.get(sql, [courses_to_add[i].trim()], (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      courseStatus[row.id] = 1;
      // console.log(courseStatus[row.id]);
    });
  }

  // Close database
  db.close(err => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the courses connection.");
  });
});

function validateCourse(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(course, schema);
}

function initilization() {
  // open the database
  let db = new sqlite3.Database("../db/JayPath.db", err => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the courses database for initilization!");
  });
  db.run(
    "CREATE TABLE IF NOT EXISTS courses(id INTEGER NOT NULL PRIMARY KEY, CourseNumber TEXT, CourseTitle TEXT, Credits INTEGER, Instructor TEXT, DaysOfWeek TEXT, StartTimeEndTime TEXT, Track TEXT, Prerequisite STRING)"
  );

  // hardcode for the first iteration: add courses manually
  // plan to retrive courses from SIS API in the following iteration

  // Track: big data, computational biology, nlp, Robotics, Information securities

  // TODO: Instead of hardcode like this, create all the course using the course class
  // TODO: Each course now will has a listOfPre attribuate
  courseInfo = [
    [
      0,
      "EN.601.315",
      "Databases",
      3,
      "D. Yarowsky",
      "T, Th",
      "3:00PM - 4:15PM, 3:00PM - 4:15PM",
      "bd",
      "18"
    ],
    [
      1,
      "EN.601.434",
      "Randomized and Big Data Algorithms",
      3,
      "V. Braverman",
      "T, Th",
      "12:00PM - 1:15PM, 12:00PM - 1:15PM",
      "bd",
      "18"
    ],
    [
      2,
      "EN.601.419",
      "Cloud Computing",
      3,
      "S. Ghorbani Khaledi",
      "M, W",
      "12:00PM - 1:15PM, 12:00PM - 1:15PM",
      "bd",
      "18"
    ],
    [
      3,
      "EN.601.350",
      "Genomic Data Science",
      3,
      "S. Salzberg",
      "T, Th",
      "3:00PM - 4:15PM, 3:00PM - 4:15PM",
      "cb",
      "18"
    ],
    [
      4,
      "EN.601.455",
      "Computer Integrated Surgery",
      3,
      "R. Taylor",
      "T, Th",
      "1:30PM - 2:45PM, 1:30PM - 2:45PM",
      "cb",
      "18"
    ],
    [
      5,
      "EN.601.447",
      "Computational Genomics: Sequences",
      3,
      "B. Langmead",
      "T, Th",
      "12:00PM - 1:15PM, 12:00PM - 1:15PM",
      "cb",
      "18"
    ],
    [
      6,
      "EN.601.464",
      "Artificial Intelligence",
      3,
      "J. Sedoc, B. Van Durme",
      "T, Th",
      "9:00AM - 10:15AM, 9:00AM - 10:15AM",
      "nlp",
      "18"
    ],
    [
      7,
      "EN.601.465",
      "Natural Language Processing",
      3,
      "K. Duh",
      "M, W, F",
      "11:00AM - 11:50AM, 11:00AM - 11:50AM, 11:00AM - 11:50AM",
      "nlp",
      "18"
    ],
    [
      8,
      "EN.601.475",
      "Machine Learning",
      3,
      "P. Graff",
      "M, W, F",
      "4:30PM - 5:45PM, 4:30PM - 5:45PM, 4:30PM - 5:45PM",
      "nlp",
      "18-23-24-25"
    ],
    [
      9,
      "EN.601.463",
      "Algorithms for Sensor-Based Robotics",
      3,
      "S. Leonard",
      "T, Th",
      "4:30PM - 5:45PM, 4:30PM - 5:45PM",
      "r",
      "18"
    ],
    [
      10,
      "EN.601.455",
      "Computer Integrated Surgery I",
      4,
      "R. Taylor",
      "T, Th",
      "1:30PM - 2:45PM, 1:30PM - 2:45PM",
      "r",
      "18"
    ],
    [
      11,
      "EN.601.461",
      "Computer Vision",
      3,
      "G. Hager",
      "T, Th",
      "9:00AM - 10:15AM, 9:00AM - 10:15AM",
      "r",
      "18-23-24-25"
    ],
    [
      12,
      "EN.650.672",
      "Security Analytics",
      3,
      "L. Ding",
      "M",
      "6:00PM - 8:30PM",
      "is",
      "18"
    ],
    [
      13,
      "EN.650.663",
      "Cloud Computing Security",
      3,
      "C. Monson",
      "F",
      "1:30PM - 4:00PM",
      "is",
      "18"
    ],
    [
      14,
      "EN.650.624",
      "Network Security",
      3,
      "R. Johnston",
      "M, W",
      "3:00PM - 4:15PM, 3:00PM - 4:15PM",
      "is",
      "18"
    ],
    [
      15,
      "EN.601.220",
      "Intermediate Programming",
      4,
      "D. Hovemeyer",
      "M, W, F",
      "12:00PM - 1:15PM, 12:00PM - 1:15PM, 12:00PM - 1:15PM",
      "core",
      "16"
    ],
    [
      16,
      "EN.500.112",
      "Gateway Computing: JAVA",
      3,
      "S. More",
      "M, W, F",
      "9:00AM - 9:50AM, 9:00AM - 9:50AM, 9:00AM - 9:50AM",
      "core",
      ""

    ],
    [
      17,
      "EN.601.104",
      "Computer Ethics",
      1,
      "T. Leschke",
      "W",
      "4:30PM - 6:30PM",
      "core",
      ""
    ],
    [
      18,
      "EN.601.226",
      "Data Structures",
      4,
      "J. Selinski",
      "M, W, F",
      "1:30PM - 2:45PM, 1:30PM - 2:45PM, 1:30PM - 2:45PM",
      "core",
      "15"
    ],
    [
      19,
      "EN.601.229",
      "Computer System Fundamentals",
      3,
      "P. Koehn",
      "M, W, F",
      "10:00AM - 10:50AM, 10:00AM - 10:50AM, 10:00AM - 10:50AM",
      "core",
      "18"
    ],
    [
      20,
      "EN.601.231",
      "Automata & Computation Theory",
      3,
      "S. Kosaraju",
      "T, Th",
      "9:00AM - 10:15AM, 9:00AM - 10:15AM",
      "core",
      "18"
    ],
    [
      21,
      "EN.601.433",
      "Intro Algorithms",
      3,
      "M. Dinitz",
      "T, Th",
      "12:00PM - 1:15PM, 12:00PM - 1:15PM",
      "core",
      "18-22"
    ],
    [
      22,
      "EN.553.171",
      "Discrete Mathematics",
      4,
      "B. Castello",
      "M, W, F, Th",
      "10:00AM - 10:50AM, 10:00AM - 10:50AM, 10:00AM - 10:50AM, 9:00AM - 9:50AM",
      "core",
      ""
    ],
    [
      23,
      "EN.553.420",
      "Intro to Probability",
      4,
      "J. Wierman",
      "M, W, F, Th",
      "1:30PM - 2:20PM, 1:30PM - 2:20PM, 1:30PM - 2:20PM, 10:30AM - 11:20AM",
      "core",
      "25"
    ],
    [
      24,
      "EN.553.430",
      "Introduction to Statistics",
      4,
      "D. Athreya",
      "MWF, Th",
      "1:30PM - 2:45PM, 1:30PM - 2:45PM, 1:30PM - 2:45PM, 9:00AM - 9:50AM",
      "core",
      "25"
    ],
    [
      25,
      "AS.110.201",
      "Linear Algebra",
      4,
      "J. Han",
      "MWF, Th",
      "10:00AM - 10:50AM, 10:00AM - 10:50AM, 10:00AM - 10:50AM, 1:30PM - 2:20",
      "core",
      ""
    ]
  ];

  for (var course in courseInfo) {
    courseName.push(course[2]);
  }
  // create the statement for the insertion of just ONE record
  let queryInfo =
    "INSERT OR REPLACE INTO courses(id, CourseNumber, CourseTitle, Credits, Instructor, DaysOfWeek, StartTimeEndTime, Track, Prerequisite) " +
    "VALUES (?, ?, ? ,?, ?, ?, ? ,?, ?)";

  // 'prepare' returns a 'statement' object which allows us to
  // bind the same query to different parameters each time we run it
  let statement = db.prepare(queryInfo);

  // run the query over and over for each inner array
  for (var i = 0; i < courseInfo.length; i++) {
    statement.run(courseInfo[i], function (err) {
      if (err) throw err;
    });
  }
  statement.finalize();

  // close the database
  db.close(err => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the courses database connection for initilization!");
  });
}

function filterByPre(courseStatus, field, callback) {
  // Open and connect to database
  console.log("filterByPre function is called!");
  let courses = []
  let db = new sqlite3.Database("../db/JayPath.db", err => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the courses database.");
  });


  // Extract course according to the focus area and sent it back to the front end for displaying.
  let sql = `SELECT * FROM courses WHERE Track = ?;`;
  db.all(sql, [field], (err, allcourse) => {
    if (err) {
      throw err;
    }
    allcourse.forEach(course => {
      // check coursestcoursestatusatus, its prerequisite
      if (courseStatus[course.id] == 0) {  // not taken yet
        let pre_original = course.Prerequisite;
        let pre = pre_original.toString().split("-");
        let fulfill_flag = 1;
        for (var i = 0; i < pre.length; i++) {
          if (courseStatus[pre[i]] == 0) {
            fulfill_flag = 0;  // not fulfill the prerequisite
            break;
          }
        }
        if (fulfill_flag == 1) {
          courses.push(course);  // add a course to courses
        }
      }
    });
  });

  let sql_1 = `SELECT * FROM courses WHERE Track = ?;`;
  db.all(sql_1, ["core"], (err, allcourse) => {
    if (err) {
      throw err;
    }
    allcourse.forEach(course => {
      // check coursestatus, its prerequisite
      if (courseStatus[course.id] == 0) {  // not taken yet
        let pre_original = course.Prerequisite;
        // console.log(pre_original);

        let pre = pre_original.toString().split("-");
        let fulfill_flag = 1;
        for (var i = 0; i < pre.length; i++) {
          if (courseStatus[pre[i]] == 0) {
            fulfill_flag = 0;  // not fulfill the prerequisite
            break;
          }
        }
        if (fulfill_flag == 1) {
          courses.push(course);  // add a course to courses
        }
      }
    });
  });
  // Close database
  db.close(err => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the courses connection.");
    courses = callback(courses);
    return courses;
  });
}

// PORT
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Listening on port " + port));
