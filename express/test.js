var course_node = require("./course_node");
var one_semester = require("./one_semester");
var all_semester = require("./all_semesters");
var one_schedule = require("./one_schedule");
let test = new course_node([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
let test_list = [];
test_list.push(test);
let all = all_semester.get_all_semesters(test_list, "NLP");

// let schedule_list = one_schedule.get_schedule_simple(all);
// let last_semester_schedule = schedule_list[-1].get_status;
// console.log(last_semester_schedule);
