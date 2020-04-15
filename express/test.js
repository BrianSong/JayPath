var course_node = require("./course_node");
var one_semester = require("./one_semester");
var all_semesters = require("./all_semesters");
var one_schedule = require("./one_schedule");

let field = "nlp";
let courses_track = ["core", "core", "core", "core", "core", "core", "core", "core", "elective", "elective", "core", "core", "core", "core", "core", "core", "core", "core", "core", "core", "core", "core", "core", "bd", "bd", "bd", "cb", "cb", "cb", "nlp", "nlp", "nlp", "r", "r", "r", "is", "is", "is", "is", "r", "bd", "nlp", "nlp", "core", "core", "core", "core"];
let courses_pre = ["", "", "", "2", "3", "3", "3", "3-6-12", "3", "3", "", "10", "", "11", "11-13", "11-13-14", "", "", "", "", "", "", "", "3", "3", "3", "3", "3", "3", "3", "3", "3-11-13-14-15", "3", "3-26", "3-11-13-14-15", "3", "3", "3", "3", "3", "3", "3-11-13-14-15-30", "3-11-13-14-15-30", "", "", "", "44"];

let user_semester = [new course_node(Array(courses_pre.length).fill(0))];
console.log("user_semester status: " + user_semester[0].get_status);


let all_semesters_list = all_semesters.get_all_semesters(user_semester, field, courses_track, courses_pre);
// console.log(all_semesters_list);

let one_schedule_list = one_schedule.get_schedule(all_semesters_list);
console.log(one_schedule_list);