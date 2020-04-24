const Joi = require("joi");
const express = require("express");
const app = express();
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
// const schedule = require("./schedule");
const filter = require("./filter");
const initial = require("./initial");

app.use(express.json());
app.use(cors());


// Initilization for database.
// Initialize all course status to 0.
let courseStatus = new Map();
let preferCourse = new Map();
initial.initilization(courseStatus, preferCourse);
let student = new Student(0, courseStatus, null);


// The frontend will sent req to this URL for information of courses so that the user can select which course they have taken.
app.get("/api/courses", (req, res) => {
    // Open the database
    let db = new sqlite3.Database("../db/JayPath.db", err => {
        if (err) {
            console.error(err.message);
        }
        console.log("Connected to the courses database.");
    });
    let currCourse = [];

    // Extract all the courses and sent it back to the frontend for displaying.
    let sql = `SELECT * FROM courses;`;

    db.all(sql, (err, allCourses) => {
        if (err) {
            return console.error(err.message);
        }
        allCourses.forEach((allCourse) => {
            currCourse.push(allCourse);
        })
    });

    // Close database
    db.close(err => {
        if (err) {
            console.error(err.message);
        }
        console.log("Close the courses connection.");
        // send the result to frontend
        res.send(currCourse);
    });

});

app.get("/api/:field/courses", (req, res) => {
    // send candidate courses to backend
    let field = String(req.params.field);
    let courses = [];
    let course_id = [];

    let courses_track = courses_info[1];
    let courses_pre = courses_info[2];


    let user_semester = [new course_node(courseStatus)];
    console.log("user_semester status: " + user_semester[0].get_status);
    let all_semesters_list = all_semesters.get_all_semesters(user_semester, field, courses_track, courses_pre);
    let one_schedule_list = one_schedule.get_schedule(all_semesters_list);

    if (one_schedule_list.length != 0) {
        for (var i = 0; i < one_schedule_list.length; i++) {
            var semester_course_statue = one_schedule_list[i].get_status();
            for (var j = 0; j < semester_course_statue.length; j++) {
                if (semester_course_statue[j] == 1) {
                    if (course_id.indexOf(j) == -1) {
                        course_id.push(j);
                    }
                }
            }
        }

        let db = new sqlite3.Database("../db/JayPath.db", err => {
            if (err) {
                console.error(err.message);
            }
            console.log("Connected to the courses database.");
        });

        // Extract course according to the focus area and sent it back to the front end for displaying.
        let sql = `SELECT * FROM courses WHERE id = ?;`;
        for (var i = 0; i < course_id.length; i++) {
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

    } else {
        res.send(courses);
    }
});

// API for courses students has taken
app.post("/api/user_info", (req, res) => {
    courses_to_add = req.body;
    // Open and connect to database
    let db = new sqlite3.Database("../db/JayPath.db", err => {
        if (err) {
            console.error(err.message);
        }
        console.log("Connected to the courses database.");
    });

    // Extract course according to the focus area and sent it back to the front end for displaying.
    let sql = `SELECT * FROM courses WHERE CourseTitle = ?;`;


    for (var i = 0; i < courses_to_add.length; i++) {
        db.get(sql, [courses_to_add[i].trim()], (err, row) => {
            if (err) {
                return console.error(err.message);
            }
            for (const [course, status] of courseStatus.entries()) {
                if (course.CourseTitle == row.CourseTitle) {
                    courseStatus.set(course, 1); //update: course have taken
                    break;
                }
            }
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

// API for student's current semester and semester he/she wants to enroll in
app.post("/api/semesters_info", (req, res) => {
    semesters_info = req.body;

});


// API for courses the student wants to prioritize
app.post("/api/courses_prioritized", (req, res) => {
    let prefer_to_take = req.body;

    // Open and connect to database
    let db = new sqlite3.Database("../db/JayPath.db", err => {
        if (err) {
            console.error(err.message);
        }
        console.log("Connected to the courses database.");
    });

    // Extract course according to the focus area and sent it back to the front end for displaying.
    let sql = `SELECT * FROM courses WHERE CourseTitle = ?;`;


    for (var i = 0; i < prefer_to_take.length; i++) {
        db.get(sql, [prefer_to_take[i].trim()], (err, row) => {
            if (err) {
                return console.error(err.message);
            }
            for (const [course, status] of preferCourse.entries()) {
                if (course.CourseTitle == row.CourseTitle) {
                    preferCourse.set(course, 1); //update: course have taken
                    break;
                }
            }
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


const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Listening on port " + port));