// const sqlite3 = require("sqlite3").verbose();
module.exports = {
    filterByPre: function filterByPre(courseStatus, field, courses_track, courses_pre) {
        // let courses_track = ["core", "core", "core", "core", "core", "core", "core", "core", "elective", "elective", "core", "core", "core", "core", "core", "core", "core", "core", "core", "core", "core", "core", "core", "bd", "bd", "bd", "cb", "cb", "cb", "nlp", "nlp", "nlp", "r", "r", "r", "is", "is", "is", "is", "r", "bd", "nlp", "nlp", "core", "core", "core", "core"];
        // let courses_pre = ["", "", "", "2", "3", "3", "3", "3-6-12", "3", "3", "", "10", "", "11", "11-13", "11-13-14", "", "", "", "", "", "", "", "3", "3", "3", "3", "3", "3", "3", "3", "3-11-13-14-15", "3", "3-26", "3-11-13-14-15", "3", "3", "3", "3", "3", "3", "3-11-13-14-15-30", "3-11-13-14-15-30", "", "", "", "44"];
        let eligible_course = [];
        for (var i = 0; i < courseStatus.length; i++) {
            if (courseStatus[i] == 0 && (courses_track[i] == field || courses_track[i] == 'core' || courses_track[i] == 'elective')) {
                let fulfill_flag = 1;
                let curr_pre = courses_pre[i].split("-");
                for (var j = 0; j < curr_pre.length; j++) {
                    if (courseStatus[curr_pre[j]] == 0) {
                        fulfill_flag = 0;  // not fulfill the prerequisite
                        break;
                    }
                }
                if (fulfill_flag == 1) {
                    eligible_course.push(i);  // add a course to courses
                }
            }
        }
        //console.log("Finish filtering the courses by prerequisites!");
        return eligible_course
        // // Open and connect to database
        // console.log("filterByPre function is called!");
        // let courses = []
        // let db = new sqlite3.Database("../db/JayPath.db", err => {
        //     if (err) {
        //         console.error(err.message);
        //     }
        //     console.log("Connected to the courses database.");
        // });

        // // Extract course according to the focus area and sent it back to the front end for displaying.
        // let sql = `SELECT * FROM courses WHERE Track = ?;`;

        // db.all(sql, [field], (err, allcourse) => {
        //     if (err) {
        //         throw err;
        //     }
        //     allcourse.forEach(course => {
        //         // check coursestcoursestatusatus, its prerequisite
        //         if (courseStatus[course.id] == 0) {  // not taken yet
        //             let pre_original = course.Prerequisite;
        //             let pre = pre_original.toString().split("-");
        //             let fulfill_flag = 1;
        //             for (var i = 0; i < pre.length; i++) {
        //                 if (courseStatus[pre[i]] == 0) {
        //                     fulfill_flag = 0;  // not fulfill the prerequisite
        //                     break;
        //                 }
        //             }
        //             if (fulfill_flag == 1) {
        //                 courses.push(course);  // add a course to courses
        //             }
        //         }
        //     });
        // });

        // let sql_1 = `SELECT * FROM courses WHERE Track = ?;`;
        // db.all(sql_1, ["core"], (err, allcourse) => {
        //     if (err) {
        //         throw err;
        //     }
        //     allcourse.forEach(course => {
        //         // check coursestatus, its prerequisite
        //         if (courseStatus[course.id] == 0) {  // not taken yet
        //             let pre_original = course.Prerequisite;
        //             // console.log(pre_original);

        //             let pre = pre_original.toString().split("-");
        //             let fulfill_flag = 1;
        //             for (var i = 0; i < pre.length; i++) {
        //                 if (courseStatus[pre[i]] == 0) {
        //                     fulfill_flag = 0;  // not fulfill the prerequisite
        //                     break;
        //                 }
        //             }
        //             if (fulfill_flag == 1) {
        //                 courses.push(course);  // add a course to courses
        //             }
        //         }
        //     });
        // });

        // let sql_2 = `SELECT * FROM courses WHERE Track = ?;`;
        // db.all(sql_2, ["elective"], (err, allcourse) => {
        //     if (err) {
        //         throw err;
        //     }
        //     allcourse.forEach(course => {
        //         // check coursestatus, its prerequisite
        //         if (courseStatus[course.id] == 0) {  // not taken yet
        //             let pre_original = course.Prerequisite;
        //             // console.log(pre_original);

        //             let pre = pre_original.toString().split("-");
        //             let fulfill_flag = 1;
        //             for (var i = 0; i < pre.length; i++) {
        //                 if (courseStatus[pre[i]] == 0) {
        //                     fulfill_flag = 0;  // not fulfill the prerequisite
        //                     break;
        //                 }
        //             }
        //             if (fulfill_flag == 1) {
        //                 courses.push(course);  // add a course to courses
        //             }
        //         }
        //     });
        // });

        // // Close database
        // db.close(err => {
        //     if (err) {
        //         console.error(err.message);
        //     }
        //     console.log("Close the courses connection.");
        //     console.log("Finish filtering the courses by prerequisites!")
        //     return callback(courseStatus, courses);
        // });
    },
};
