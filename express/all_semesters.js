const one_semester = require("./one_semester");
var course_node = require("./course_node");
const grad = require("./check_graduation");

module.exports = {
    get_all_semesters: function get_all_semesters(user_semester_list, field, term, semesters_left) {
        // input: user course nodes list (a list contains a single course node)
        // output: a list where each element (corresponding to a term) is a list of course codes

        let all_semesters = []; // every element is a list of course nodes
        let curr_semester_nodes_list = [];

        while (all_semesters.length < semesters_left) {
            // generate the next semester nodes based on the previous semester nodes
            if (all_semesters.length == 0) { // use user semester if generating the first semester
                curr_semester_nodes_list = one_semester.get_one_semester(user_semester_list, field, term);
            } else {
                curr_semester_nodes_list = one_semester.get_one_semester(all_semesters[all_semesters.length - 1], field, term);
            }
            
            // exit if no more courses to take
            if (curr_semester_nodes_list.length == 0) {
                console.log("no more courses to take, exiting...");
                // let keys = all_semesters[all_semesters.length - 1][0].get_status.values();
                let testNodeList = [all_semesters[all_semesters.length - 1][0]];
                console.log(all_semesters[all_semesters.length - 1][0].get_status);
                // let t = one_semester.get_one_semester(testNodeList, field, term);
                // console.log("test length: " + t.length);
                return all_semesters;
            }

            // add current semester node list into all semesters
            all_semesters.push(curr_semester_nodes_list);
            
            // change term for generating next semester
            if (term == "Fall") {
                term = "Spring";
            } else {
                term = "Fall";
            }
        }
        
        return all_semesters;

        // ONLY FOR TESTING: set values for all course nodes at the last semester to 1
        // for (var i = 0; i < all_semesters[all_semesters.length - 1].length; i++) {
        //     all_semesters[all_semesters.length - 1][i].change_node_value(1);
        //     grad_flag = true;
        // }

        // if (grad_flag) {
        //     return all_semesters; // note all the nodes should have values assinged, but only the values at the last semester matters
        // } else {
        //     return []; // cannot graduate, dump everything
        // }
    }
};

// function check_grad(nodes_list, field, courses_track, courses_pre) {
//     for (var i = 0; i < nodes_list.length; i++) {
//         nodes_list[i].change_node_value(0);
//     }
//     return false;
// }