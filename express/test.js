var course_node = require("./course_node");
var one_semester = require("./one_semester");
var all_semesters = require("./all_semesters");
var one_schedule = require("./one_schedule");
const initial = require("./initial");



// construct user input
let field = "nlp";
let term = "Fall";

// initialize user_semester_status
let user_semester_status = new Map();
initial.initilization(user_semester_status);
console.log("number of courses: " + user_semester_status.size);

// initialize user_semester_list
let user_semester_list = [new course_node(user_semester_status)];
// console.log("user_semester_list status: " + user_semester_list[0]);

let all_semesters_list = all_semesters.get_all_semesters(user_semester_list, field, term);
console.log(all_semesters_list[7][0].value);


// let one_schedule_list = one_schedule.get_schedule(all_semesters_list);
// console.log(one_schedule_list.length);
// console.log(one_schedule_list[0]);


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