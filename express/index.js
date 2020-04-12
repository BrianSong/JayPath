const Joi = require("joi");
const express = require("express");
const app = express();
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const schedule = require("./schedule");
const filter = require("./filter");
const initial = require("./initial");

app.use(express.json());
app.use(cors());

let courseName = [];
let courses_info = [];

initial.initilization(courseName, courses_info);

// let courses = [];  // all the candidate courses (ready to be chosen if no time conflict)
let courseStatus = [];
for (var id_loop = 0; id_loop <= 46; id_loop++) {
  courseStatus[id_loop] = 0; // initialize all course status to 0 
}
// let course_to_id = new Map();
// for (var id_loop = 0; id_loop <= 25; id_loop++) {
//   courseStatus.set(id_loop, 0); // initialize all course status to 0 
// }

// app.get("/", (req, res) => {
//   res.send("Hello World!!");
// });

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

// app.get("/api/test", (req, res) => {
//   res.send("Test API is Working!");
// });

app.get("/api/:field/courses", (req, res) => {
  // send candidate courses to backend
  let field = String(req.params.field);
  let courses = [];
  let course_id = [];
  for (var i = 0; i < 25; i++) {
    course_id.push(Math.floor(Math.random() * 30));
  }

  // let user_course_node = new (courseStatus);
  // let all = all_semesters.get_all_semesters(user_course_node, field);
  // let schedule_list = one_schedule.get_schedule_simple(all);
  // let last_semester_schedule = schedule_list[-1].get_status;
  // for(var i = 0; i < last_semester_schedule.length; i++){
  //   if(last_semester_schedule[i] == 1){
  //     course_id.push(i);
  //   }
  // }

  let db = new sqlite3.Database("../db/JayPath.db", err => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the courses database.");
  });

  // Extract course according to the focus area and sent it back to the front end for displaying.
  let sql = `SELECT * FROM courses WHERE id = ?;`;
  for (var i = 0; i < course_id.length; i++) {
    // console.log(courses_to_add[i]);
    db.all(sql, [course_id[i]], (err, allcourse) => {
      if (err) {
        return console.error(err.message);
      }
      allcourse.forEach(course => {
        courses.push(course);
      })
    });
  }

  // Close database
  db.close(err => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the courses connection.");
    res.send(courses);
  });
});

// app.post("/api/courses", (req, res) => {
//   const { error } = validateCourse(req.body); //object destructuring
//   if (error) {
//     // 400 Bad Request
//     res.status(400).send(error.details[0].message);
//     return;
//   }
//   const course = {
//     id: courses.length + 1,
//     name: req.body.name
//   };
//   courses.push(course);
//   res.send(course);
// });

// app.put("/api/courses/:id", (req, res) => {
//   //Lookup Course
//   const course = courses.find(c => c.id == parseInt(req.params.id));

//   if (!course) {
//     res.status(404).send("Course not found");
//   }

//   //const result = validateCourse(req.body);
//   const result = validateCourse(req.body); //object destructuring
//   if (result.error) {
//     // 400 Bad Request
//     res.status(400).send(result.error.details[0].message);
//     return;
//   }

//   course.name = req.body.name;
//   res.send(course);
// });

// /api/courses/1

// app.get("/api/courses/:id", (req, res) => {
//   const course = courses.find(c => c.id == parseInt(req.params.id));
//   if (!course) {
//     res.status(404).send("Course not found");
//   } //404
//   res.send(course);
// });

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

// function validateCourse(course) {
//   const schema = {
//     name: Joi.string()
//       .min(3)
//       .required()
//   };
//   return Joi.validate(course, schema);
// }

// PORT
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Listening on port " + port));