var course_node = require("./course_node");
var one_semester = require("./one_semester");
var all_semesters = require("./all_semesters");
var one_schedule = require("./one_schedule");
const initial = require("./initial");

let field = "nlp";
let term = "fall";
let user_semester_status = new Map();
initial.initilization(user_semester_status);
let user_semester = [new course_node(user_semester_status)];
console.log("user_semester status: " + user_semester[0].get_status);

let one_semester_list = one_semester.get_one_semester(user_semester, field, term);
//console.log(one_semester_list.length);
// let all_semesters_list = all_semesters.get_all_semesters(user_semester, field, courses_track, courses_pre);
// console.log(all_semesters_list[0][0]);
// let one_schedule_list = one_schedule.get_schedule(all_semesters_list);
// console.log(one_schedule_list);
// course_id = []
// if (one_schedule_list.length != 0) {
//     for (var i = 0; i < one_schedule_list.length; i++) {
//         var semester_course_statue = one_schedule_list[i].status;
//         for (var j = 0; j < semester_course_statue.length; j++) {
//             if (semester_course_statue[j] == 1) {
//                 if (course_id.indexOf(j) == -1) {
//                     course_id.push(j);
//                 }
//             }
//         }
//     }
// }
// console.log(course_id);
// // Initilization for database.
// coursesList = initial.initilization();