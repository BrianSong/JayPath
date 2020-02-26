const Joi = require("joi");
const express = require("express");
const app = express();
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

app.use(express.json());
app.use(cors());

// open the database
let db = new sqlite3.Database("../db/JayPath.db", err => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the courses database for initilization!");
});

db.run(
  "CREATE TABLE IF NOT EXISTS courses(id INTEGER NOT NULL PRIMARY KEY, CourseNumber TEXT, CourseTitle TEXT, Credits INTEGER, Instructor TEXT, DaysOfWeek TEXT, StartTimeEndTime TEXT, Track TEXT)"
);

buildDB();

// close the database
db.close(err => {
  if (err) {
    console.error(err.message);
  }
  console.log("Close the courses database connection for initilization!");
});

let courses = [];

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/test", (req, res) => {
  res.send("Test API is Working!");
});

app.get("/api/:field/courses", (req, res) => {
  const field = String(req.params.field);
  //  for (let i = 0; i < courses.length; i++){
  //      if(courses[i].field == field){
  //           res.send(courses[i])
  //      }
  //  }

  // Open database
  let db = new sqlite3.Database("../db/JayPath.db", err => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the courses database.");
  });

  // Extract course according to the focus area and sent it back to the front end for displaying.
  let sql = `SELECT * FROM courses WHERE Track = ?;`;
  db.all(sql, [String(field)], (err, course) => {
    if (err) {
      throw err;
    }
    course.forEach(course => {
      courses.push(course);
    });
  });

  // Close database
  db.close(err => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the courses connection.");

    res.send(courses);
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

function validateCourse(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(course, schema);
}

function buildDB() {
  // hardcode for the first iteration: add courses manually
  // plan to retrive courses from SIS API in the following iteration

  // Track: big data, computational biology, nlp, Robotics, Information securities
  let courseInfo = [
     [0, "601", "OOSE", 3, "Avi", "TT", "12", "bigdata"],
     [1, "601", "databases", 3, "Sara", "TT", "9", "bigdata"]
  ];

  // create the statement for the insertion of just ONE record
  let queryInfo = 
     "INSERT OR REPLACE INTO courses(id, CourseNumber, CourseTitle, Credits, Instructor, DaysOfWeek, StartTimeEndTime, Track) " +
     "VALUES (?, ?, ? ,?, ?, ?, ? ,?)";

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

}

// PORT
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Listening on port " + port));
