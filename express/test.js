const initial = require("./initial");
var CourseNode = require("./model/CourseNode");
var one_semester = require("./one_semester");
var all_semesters = require("./all_semesters");
var one_schedule = require("./one_schedule");

// construct user input
let field = "nlp";
let term = "Fall";
let semesters_left = 8;

// initialize the user_semester_status
let user_semester_status = new Map();
let user_prefer_courses = new Map();
initial.initilization(user_semester_status, user_prefer_courses);
console.log("number of courses: " + user_semester_status.size);
console.log();

// initialize the user_semester_list
let user_semester_list = [new CourseNode(user_semester_status)];

// Test case 1: one_semester
let one_semester_list = one_semester.get_one_semester(user_semester_list, field, term);
console.log("one_semester_list length: " + one_semester_list.length);
console.log("one_semester_list first element: " + one_semester_list[0]);
console.log();

// Test case 2: all_semesters
let all_semesters_list = all_semesters.get_all_semesters(user_semester_list, field, term, semesters_left);
console.log("one_schedule_list length: " + one_schedule_list.length);
console.log("one_schedule_list first element length: " + one_schedule_list[0].length);
console.log();

// Test case 3: one_schedule_list
let one_schedule_list = one_schedule.get_schedule(all_semesters_list, user_prefer_courses);
console.log("first schedule: " + one_schedule_list[0].length);
console.log("second schedule: " + one_schedule_list[1].length);
console.log("third schedule: " + one_schedule_list[2].length);
console.log();
console.log("first schedule status: " + one_schedule_list[0][0].status);
console.log();