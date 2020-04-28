var course_node = require("./course_node");
var one_semester = require("./one_semester");
var all_semesters = require("./all_semesters");
var one_schedule = require("./one_schedule");
const initial = require("./initial");

// construct user input
let field = "nlp";
let term = "Fall";
let semesters_left = 8;

// initialize user_semester_status
let user_semester_status = new Map();
let user_prefer_courses = new Map();
initial.initilization(user_semester_status, user_prefer_courses);
console.log("number of courses: " + user_semester_status.size);

// initialize user_semester_list
let user_semester_list = [new course_node(user_semester_status)];
// console.log("user_semester_list status: " + user_semester_list[0]);

let all_semesters_list = all_semesters.get_all_semesters(user_semester_list, field, term, semesters_left);
let one_schedule_list = one_schedule.get_schedule(all_semesters_list, user_prefer_courses);
console.log();
console.log("one_schedule_list length: " + one_schedule_list.length);
console.log();
console.log("first schedule: " + one_schedule_list[0][0]);
console.log(one_schedule_list[0][0].status);
console.log("second schedule: " + one_schedule_list[1].length);
console.log("third schedule: " + one_schedule_list[2].length);
console.log();

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