const sqlite3 = require("sqlite3").verbose();
module.exports = {
    filterByPre: function filterByPre(courseStatus, field, callback) {
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
            console.log("Finish filtering the courses by prerequisites!")
            return callback(courses);
        });
    },
};