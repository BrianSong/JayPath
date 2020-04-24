// const sqlite3 = require("sqlite3").verbose();
module.exports = {
    // filterByPre: function filterByPre(courseStatus, field, courses_track, courses_pre) {
    filterByPre: function filterByPre(courseStatus, field, term, courseList) {
        // id, CourseNumber, CourseTitle, Credits, Instructor, DaysOfWeek, 
        // StartTimeEndTime, Track, Prerequisite, Conflicts, Term, Area
        // let courses_track = []
        // for (var i = 0; i < courseList.length; i++) {

        // }
        // let courses_pre = []

        let eligible_course = [];
        for (var i = 0; i < courseStatus.length; i++) {
            if (courseStatus[i] == 0 && (courseList[i].Track == field || courseList[i].Track == 'core' || courseList[i].Track == 'elective') && (courseList[i].Term == term || courseList[i].Term == "Both")) {
                let fulfill_flag = 1;
                let curr_pre = courseList[i].Prerequisite.split("-");
                for (var j = 0; j < curr_pre.length; j++) {
                    if (courseStatus[curr_pre[j]] == 0) {
                        fulfill_flag = 0;  // not fulfill the prerequisite
                        break;
                    }
                }
                if (fulfill_flag == 1) {
                    eligible_course.push(courseList[i]);  // add a course to courses
                }
            }
        }

        let priorityEligibleCourse = [];

        for (var i = 0; i < eligible_course.length; i++) {
            if (eligible_course[i].Track == field) {
                priorityEligibleCourse.push(eligible_course[i]);
            }
        }

        for (var i = 0; i < eligible_course.length; i++) {
            if (eligible_course[i].Track == 'core') {
                priorityEligibleCourse.push(eligible_course[i]);
            }
        }

        for (var i = 0; i < eligible_course.length; i++) {
            if (eligible_course[i].Track == 'elective') {
                priorityEligibleCourse.push(eligible_course[i]);
            }
        }

        //console.log("Finish filtering the courses by prerequisites!");
        return priorityEligibleCourse


        // // Open and connect to database
        // console.log("filterByPre function is called!");

        // var DEFERRED = require('deferred');
        // var dfrd1 = new DEFERRED();

        // // var dfrd2= $.Deferred();


        // let courses = []
        // // defer.promise(courses);

        // setTimeout(function(){
        //     // doing async stuff
        //     console.log('Opening databases!');
        //     let db = new sqlite3.Database("../db/JayPath.db", err => {
        //         if (err) {
        //             console.error(err.message);
        //         }
        //         console.log("Connected to the courses database.");
        //     });
        //     dfrd1.resolve(courses);
        //     // Extract course according to the focus area and sent it back to the front end for displaying.
        //     let sql = `SELECT * FROM courses WHERE Track = ?;`;

        //     db.all(sql, [field], (err, allcourse) => {
        //         if (err) {
        //             throw err;
        //         }
        //         allcourse.forEach(course => {
        //             // check coursestcoursestatusatus, its prerequisite
        //             if (courseStatus[course.id] == 0) {  // not taken yet
        //                 let pre_original = course.Prerequisite;
        //                 let pre = pre_original.toString().split("-");
        //                 let fulfill_flag = 1;
        //                 for (var i = 0; i < pre.length; i++) {
        //                     if (courseStatus[pre[i]] == 0) {
        //                         fulfill_flag = 0;  // not fulfill the prerequisite
        //                         break;
        //                     }
        //                 }
        //                 if (fulfill_flag == 1) {
        //                     courses.push(course);  // add a course to courses
        //                 }
        //             }
        //         });
        //     });

        //     let sql_1 = `SELECT * FROM courses WHERE Track = ?;`;
        //     db.all(sql_1, ["core"], (err, allcourse) => {
        //         if (err) {
        //             throw err;
        //         }
        //         allcourse.forEach(course => {
        //             // check coursestatus, its prerequisite
        //             if (courseStatus[course.id] == 0) {  // not taken yet
        //                 let pre_original = course.Prerequisite;
        //                 // console.log(pre_original);

        //                 let pre = pre_original.toString().split("-");
        //                 let fulfill_flag = 1;
        //                 for (var i = 0; i < pre.length; i++) {
        //                     if (courseStatus[pre[i]] == 0) {
        //                         fulfill_flag = 0;  // not fulfill the prerequisite
        //                         break;
        //                     }
        //                 }
        //                 if (fulfill_flag == 1) {
        //                     courses.push(course);  // add a course to courses
        //                 }
        //             }
        //         });
        //     });

        //     let sql_2 = `SELECT * FROM courses WHERE Track = ?;`;
        //     db.all(sql_2, ["elective"], (err, allcourse) => {
        //         if (err) {
        //             throw err;
        //         }
        //         allcourse.forEach(course => {
        //             // check coursestatus, its prerequisite
        //             if (courseStatus[course.id] == 0) {  // not taken yet
        //                 let pre_original = course.Prerequisite;
        //                 // console.log(pre_original);

        //                 let pre = pre_original.toString().split("-");
        //                 let fulfill_flag = 1;
        //                 for (var i = 0; i < pre.length; i++) {
        //                     if (courseStatus[pre[i]] == 0) {
        //                         fulfill_flag = 0;  // not fulfill the prerequisite
        //                         break;
        //                     }
        //                 }
        //                 if (fulfill_flag == 1) {
        //                     courses.push(course);  // add a course to courses
        //                 }
        //             }
        //         });
        //     });

        //     // Close database
        //     db.close();
        //     }, 1000);







        // return dfrd1.promise;
        // return $.when(dfrd1).done(function(){
        //     console.log('both tasks in function1 are done');
        //     // Both asyncs tasks are done
        // }).promise();
    },
};