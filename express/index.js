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
      1,
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
      2,
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
      3,
      "EN.601.220",
      "Intermediate Programming",
      4,
      "D. Hovemeyer",
      "M, W, F",
      "12:00PM - 1:15PM, 12:00PM - 1:15PM, 12:00PM - 1:15PM",
      "core",
      "2"
    ],
    [
      4,
      "EN.601.226",
      "Data Structures",
      4,
      "J. Selinski",
      "M, W, F",
      "1:30PM - 2:45PM, 1:30PM - 2:45PM, 1:30PM - 2:45PM",
      "core",
      "3"
    ],
    [
      5,
      "EN.601.229",
      "Computer System Fundamentals",
      3,
      "P. Koehn",
      "M, W, F",
      "10:00AM - 10:50AM, 10:00AM - 10:50AM, 10:00AM - 10:50AM",
      "core",
      "3"
    ],
    [
      6,
      "EN.601.231",
      "Automata & Computation Theory",
      3,
      "S. Kosaraju",
      "T, Th",
      "9:00AM - 10:15AM, 9:00AM - 10:15AM",
      "core",
      "3"
    ],
    [
      7,
      "EN.601.433",
      "Intro Algorithms",
      3,
      "M. Dinitz",
      "T, Th",
      "12:00PM - 1:15PM, 12:00PM - 1:15PM",
      "core",
      "3-6-12"
    ],
    [
      8,
      "EN.601.290",
      3,
      "User Interfaces and Mobile Applications",
      "J. Selinski",
      "T, Th",
      "3:00PM - 4:15PM, 3:00PM - 4:15PM",
      "elective",
      "3"
    ],
    [
      9,
      "EN.601.421",
      3,
      "Object Oriented Software Engineering",
      "A. Madooei",
      "T, Th",
      "12:00PM - 1:15PM, 12:00PM - 1:15PM",
      "elective",
      "3"
    ],
    [
      10,
      "AS.110.108",
      4,
      "Calculus I",
      "J. Cutrone",
      "M",
      "8:00AM - 10:00AM",
      "core",
      ""
    ],
    [
      11,
      "AS.110.109",
      4,
      "Calculus II",
      "J. Kong",
      "M, T, Th, F",
      "10:00AM - 10:50AM, 10:00AM - 10:50AM, 4:30PM - 5:20PM, 10:00AM - 10:50AM",
      "core",
      "10"
    ],
    [
      12,
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
      13,
      "AS.110.201",
      "Linear Algebra",
      4,
      "J. Han",
      "MWF, Th",
      "10:00AM - 10:50AM, 10:00AM - 10:50AM, 10:00AM - 10:50AM, 1:30PM - 2:20",
      "core",
      "11"
    ],
    [
      14,
      "EN.553.420",
      "Intro to Probability",
      4,
      "J. Wierman",
      "M, W, F, Th",
      "1:30PM - 2:20PM, 1:30PM - 2:20PM, 1:30PM - 2:20PM, 10:30AM - 11:20AM",
      "core",
      "11-13"
    ],
    [
      15,
      "EN.553.430",
      "Introduction to Statistics",
      4,
      "D. Athreya",
      "MWF, Th",
      "1:30PM - 2:45PM, 1:30PM - 2:45PM, 1:30PM - 2:45PM, 9:00AM - 9:50AM",
      "core",
      "11-13-14"
    ],
    [
      16,
      "AS.270.114",
      "Guided Tour: The Planets",
      3,
      "K. Lewis, D. Sing",
      "T, Th",
      "3:00PM - 4:15PM, 3:00PM - 4:15PM",
      "core",
      ""
    ],
    [
      17,
      "AS.050.116",
      "Visual Cognition",
      3,
      "L. Isik",
      "M, W",
      "1:30PM - 2:45PM, 1:30PM - 2:45PM",
      "core",
      ""
    ],
    [
      18,
      "AS.171.108",
      "General Physics for Physical Science Majors(AL)",
      4,
      "D. Sing",
      "T, Th, F",
      "9:00AM - 10:15AM, 9:00AM - 10:15AM, 8:00AM - 8:50AM",
      "core",
      ""
    ],
    [
      19,
      "AS.171.111",
      "General Physics Laboratory",
      1,
      "J. Mumford",
      "T",
      "1:30PM - 4:20PM",
      "core",
      ""
    ],
    [
      19,
      "AS.200.110",
      "Introduction to Cognitive Psychology",
      3,
      "J. Flombaum",
      "T, Th",
      "12:00PM - 1:15PM, 12:00PM - 1:15PM",
      "core",
      ""
    ],
    [
      20,
      "AS.200.133",
      "Introduction to Social Psychology",
      3,
      "S. Drigotas",
      "M, W, F",
      "11:00AM - 11:50AM, 11:00AM - 11:50AM, 11:00AM - 11:50AM",
      "core",
      ""
    ],
    [
      21,
      "EN.661.110",
      "Professional Writing and Communication",
      3,
      "S. Smith",
      "T, Th",
      "10:30AM - 11:45AM, 10:30AM - 11:45AM",
      "core",
      ""
    ],
    [
      22,
      "EN.601.315",
      "Databases",
      3,
      "D. Yarowsky",
      "T, Th",
      "3:00PM - 4:15PM, 3:00PM - 4:15PM",
      "bd",
      "3"
    ],
    [
      23,
      "EN.601.434",
      "Randomized and Big Data Algorithms",
      3,
      "V. Braverman",
      "T, Th",
      "12:00PM - 1:15PM, 12:00PM - 1:15PM",
      "bd",
      "3"
    ],
    [
      24,
      "EN.601.419",
      "Cloud Computing",
      3,
      "S. Ghorbani Khaledi",
      "M, W",
      "12:00PM - 1:15PM, 12:00PM - 1:15PM",
      "bd",
      "3"
    ],
    [
      25,
      "EN.601.350",
      "Genomic Data Science",
      3,
      "S. Salzberg",
      "T, Th",
      "3:00PM - 4:15PM, 3:00PM - 4:15PM",
      "cb",
      "3"
    ],
    [
      26,
      "EN.601.455",
      "Computer Integrated Surgery",
      3,
      "R. Taylor",
      "T, Th",
      "1:30PM - 2:45PM, 1:30PM - 2:45PM",
      "cb",
      "3"
    ],
    [
      27,
      "EN.601.447",
      "Computational Genomics: Sequences",
      3,
      "B. Langmead",
      "T, Th",
      "12:00PM - 1:15PM, 12:00PM - 1:15PM",
      "cb",
      "3"
    ],
    [
      28,
      "EN.601.464",
      "Artificial Intelligence",
      3,
      "J. Sedoc, B. Van Durme",
      "T, Th",
      "9:00AM - 10:15AM, 9:00AM - 10:15AM",
      "nlp",
      "3"
    ],
    [
      29,
      "EN.601.465",
      "Natural Language Processing",
      3,
      "K. Duh",
      "M, W, F",
      "11:00AM - 11:50AM, 11:00AM - 11:50AM, 11:00AM - 11:50AM",
      "nlp",
      "3"
    ],
    [
      30,
      "EN.601.475",
      "Machine Learning",
      3,
      "P. Graff",
      "M, W, F",
      "4:30PM - 5:45PM, 4:30PM - 5:45PM, 4:30PM - 5:45PM",
      "nlp",
      "3-11-13-14-15"
    ],
    [
      31,
      "EN.601.463",
      "Algorithms for Sensor-Based Robotics",
      3,
      "S. Leonard",
      "T, Th",
      "4:30PM - 5:45PM, 4:30PM - 5:45PM",
      "r",
      "3"
    ],
    [
      32,
      "EN.601.455",
      "Computer Integrated Surgery II",
      3,
      "R. Taylor",
      "T, Th",
      "1:30PM - 2:45PM, 1:30PM - 2:45PM",
      "r",
      "3-26"
    ],
    [
      33,
      "EN.601.461",
      "Computer Vision",
      3,
      "G. Hager",
      "T, Th",
      "9:00AM - 10:15AM, 9:00AM - 10:15AM",
      "r",
      "3-11-13-14-15"
    ],
    [
      34,
      "EN.650.672",
      "Security Analytics",
      3,
      "L. Ding",
      "M",
      "6:00PM - 8:30PM",
      "is",
      "3"
    ],
    [
      35,
      "EN.650.663",
      "Cloud Computing Security",
      3,
      "C. Monson",
      "F",
      "1:30PM - 4:00PM",
      "is",
      "3"
    ],
    [
      36,
      "EN.650.624",
      "Network Security",
      3,
      "R. Johnston",
      "M, W",
      "3:00PM - 4:15PM, 3:00PM - 4:15PM",
      "is",
      "3"
    ],
    [
      37,
      "EN.601.445",
      "Pratical Cryptographic Systems",
      3,
      "M. Green",
      "M, W",
      "12:00PM - 1:15PM, 12:00PM - 1:15PM",
      "is",
      "3"
    ],
    [
      38,
      "EN.601.454",
      "Augmented Reality",
      3,
      "N. Navab",
      "T, Th",
      "8:30AM - 10:15AM, 8:30AM - 10:15AM",
      "r",
      "3"
    ],
    [
      39,
      "EN.601.466",
      "Information Retrieval and Web Agents",
      3,
      "S. Moreira",
      "T, Th",
      "12:00PM - 1:15PM, 12:00PM - 1:15PM",
      "bd",
      "3"
    ],
    [
      40,
      "EN.601.482",
      "Machine Learning: Deep Learning",
      4,
      "S. Moreira",
      "M, W, F",
      "8:30AM - 9:45AM, 8:30AM - 9:45AM, 8:30AM - 9:45AM",
      "nlp",
      "3-11-13-14-15-30"
    ],
    [
      41,
      "EN.601.486",
      "Machine Learning: Artificial Intelligence System Design & Development",
      3,
      "M. Unberath",
      "T, Th",
      "1:30PM - 2:45PM, 1:30PM - 2:45PM",
      "nlp",
      "3-11-13-14-15-30"
    ],
    [
      42,
      "AS.171.205",
      "Introduction to Practical Data Sciecne: Beautiful Data",
      3,
      "S. Szalay",
      "M, W",
      "3:00PM - 4:15PM, 3:00PM - 4:15PM",
      "core",
      ""
    ],
    [
      43,
      "EN.553.402",
      "Research and Design in Applied Mathematics: Data Mining",
      4,
      "T. Budavari",
      "M, W, F",
      "1:30PM - 2:55PM, 1:30PM - 2:55PM, 1:30PM - 2:55PM",
      "core",
      ""
    ],
    [
      44,
      "EN.553.361",
      "Introduction to Optimization",
      4,
      "Z. Lubberts",
      "M, W, Th, F",
      "10:00AM - 10:50AM, 10:00AM - 10:50AM, 9:00AM - 9:50AM, 10:00AM - 10:50AM",
      "core",
      ""
    ],
    [
      45,
      "EN.553.362",
      "Introduction to Optimization II",
      4,
      "D. Fishkind",
      "M, W, Th, F",
      "11:00AM - 11:50AM, 11:00AM - 11:50AM, 3:00PM - 3:50PM, 11:00AM - 11:50AM",
      "core",
      "44"
    ],
    [
      46,
      "AS.110.302",
      "Differential Equations and Applications",
      4,
      "L. Sun",
      "M, T, W, F",
      "12:00PM - 12:50PM, 1:30PM - 2:20PM, 12:00PM - 12:50PM, 12:00PM - 12:50PM",
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

// PORT
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Listening on port " + port));
