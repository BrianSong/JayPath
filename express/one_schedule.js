var course_node = require("./course_node");

module.exports = {
    get_schedule: function get_schedule(all_semesters_list) {
        // input: a list, where each element (corresponding to a term) is a list of course codes
        // output: a list of course nodes, where each course node is the courses to be taked at each semester

        let schedule_list = []; // store the best course nodes for every semesters
        if (all_semesters_list.length == 0) {return schedule_list;}
        if (all_semesters_list.length == 1) {
            for (var i = 0; i < all_semesters_list[0].length; i++) {
                if (all_semesters_list[0][i].get_value == 1) { // must exist one, otherwise all_semesters_list will be []
                    return [all_semesters_list[0][i]];
                }
            }
        }

        // looping backwards starting from the second to last semester
        for (var i = all_semesters_list.length - 2; i >= 0; i--) {
            // looping over every course node in one semester
            for (var j = 0; j < all_semesters_list[i].length; j++) { // all_semesters_list[i][j] is a course node
                // get indices of child nodes at the next semester
                let child_indices_list = all_semesters_list[i][j].get_child_indices;
                let child_values_list = [];
                for (var k = 0; k < child_indices_list.length; k++) {
                    child_values_list.push(all_semesters_list[i+1][child_indices_list[k]].get_value);
                }

                // choose the best child
                let best_child_value = Math.max(...child_values_list); // destructuring assignment to extract data from arrays into distinct variables
                all_semesters_list[i][j].change_node_value(best_child_value);
                let best_child_index = child_values_list.findIndex(element => element == best_child_value); // only return the first max index
                all_semesters_list[i][j].set_best_child_index(best_child_index);
            }
        }

        // looping over the first semester to determine the schedule
        let first_semester_values_list = [];
        for (var i = 0; i < all_semesters_list[0].length; i++) {
            first_semester_values_list.push(all_semesters_list[0][i].get_value);
        }
        let best_first_semester_value = Math.max(...first_semester_values_list); // destructuring assignment to extract data from arrays into distinct variables
        let best_first_semester_index = first_semester_values_list.findIndex(element => element == best_first_semester_value);

        // get the schedule
        schedule_list.push(all_semesters_list[0][best_first_semester_index])
        for (var i = 0; i < all_semesters_list.length - 1; i++) {
            schedule_list.push(all_semesters_list[i+1][schedule_list[schedule_list.length-1].get_best_child_index])
        }

        return schedule_list
    },
};