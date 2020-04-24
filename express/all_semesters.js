const one_semester = require("./one_semester");
var course_node = require("./course_node");
const grad = require("./check_graduation");

module.exports = {
    get_all_semesters: function get_all_semesters(user_semester_list, field, courses_track, courses_pre) {
        // input: user course nodes list (a list contains a single course node)
        // output: a list where each element (corresponding to a term) is a list of course codes

        let all_semesters = []; // every element is a list of courses for a term
        let semesters_left = 8; // depending on user input
        let grad_flag = false;

        while ((!grad_flag) && (all_semesters.length < semesters_left)) {
            // get the very next semester nodes based on the previous semester nodes
            let curr_semester_nodes_list = [];
            if (all_semesters.length == 0) {
                curr_semester_nodes_list = one_semester.get_one_semester(user_semester_list, field, courses_track, courses_pre);
            } else {
                curr_semester_nodes_list = one_semester.get_one_semester(all_semesters[all_semesters.length - 1], field, courses_track, courses_pre);
            }
            if (curr_semester_nodes_list.length == 0) { return all_semesters; } // no more courses to take

            // note: check graduation before push to all semesters to make sure values are assigned
            // check graudation and assign values
            grad_flag = check_grad(curr_semester_nodes_list, field, courses_track, courses_pre);
            all_semesters.push(curr_semester_nodes_list);
        }

        // ONLY FOR TESTING: set values for all course nodes at the last semester to 1
        for (var i = 0; i < all_semesters[all_semesters.length - 1].length; i++) {
            all_semesters[all_semesters.length - 1][i].change_node_value(1);
            grad_flag = true;
        }

        if (grad_flag) {
            return all_semesters; // note all the nodes should have values assinged, but only the values at the last semester matters
        } else {
            return []; // cannot graduate, dump everything
        }
    }
};

function check_grad(nodes_list, field, courses_track, courses_pre) {
    for (var i = 0; i < nodes_list.length; i++) {
        nodes_list[i].change_node_value(0);
    }
    return false;
}