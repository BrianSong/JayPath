var course_node = require("./course_node");
var one_semester = require("./one_semester");
test = new course_node([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
console.log(test.get_status);
let nextSemester = one_semester.get_one_semester([test], "NLP");
console.log(nextSemester);