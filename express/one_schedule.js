var course_node = require("./course_node");
var check_graduation = require("./check_graduation");
var check_graduation_by_prefer = require("./check_graduation_by_prefer");

module.exports = {
    get_schedule: function get_schedule(all_semesters_list, user_prefer_courses) {
        // input: a list, where each element (corresponding to a term) is a list of course codes
        // output: a list of course nodes, where each course node is the courses to be taked at each semester

        let first_schedule = [];
        let second_schedule = [];
        let third_schedule = [];
        let all_schedules_list = [first_schedule, second_schedule, third_schedule];
        if (all_semesters_list.length == 0) { return all_schedules_list; }

        // check graduation
        let graudation_node_count = 0;
        let graudation_prefer_node_count = 0;
        for (var i = 0; i < all_semesters_list[all_semesters_list.length - 1].length; i++) {
            let curr_node = all_semesters_list[all_semesters_list.length - 1][i];
            if (check_graduation.check(curr_node.get_status)) {
                // check graudation with user preference
                if (check_graduation_by_prefer.check(curr_node.get_status, user_prefer_courses)) {
                    curr_node.change_node_value(5000);
                    graudation_prefer_node_count++;
                }
                graudation_node_count++; // count the number of course nodes that can graduate
            } else {
                curr_node.change_node_value(0);
            }
        }
        console.log();
        console.log("graudation_node_count: " + graudation_node_count);
        console.log("graudation_prefer_node_count: " + graudation_prefer_node_count);

        if (graudation_node_count == 0) { // cannot graduate
            return all_schedules_list; // [[],[],[]]
        }

        // update all course node values by looping backwards starting from the second to last semester
        for (var i = all_semesters_list.length - 2; i >= 0; i--) {
            // looping over every course node in one semester
            for (var j = 0; j < all_semesters_list[i].length; j++) { // all_semesters_list[i][j] is a course node
                // get indices of child nodes at the next semester
                let child_indices_list = all_semesters_list[i][j].get_child_indices;
                let sum = 0;
                for (var k = 0; k < child_indices_list.length; k++) {
                    sum += all_semesters_list[i + 1][child_indices_list[k]].get_value;
                }
                // change score of this course node
                all_semesters_list[i][j].change_node_value(sum);
            }
        }

        // get all node values for the first semester
        let first_semester_values_list = [];
        let first_semester_positive_node_count = 0;
        for (var i = 0; i < all_semesters_list[0].length; i++) {
            let node_value = all_semesters_list[0][i].get_value;
            first_semester_values_list.push(node_value);
            if (node_value > 0) {
                first_semester_positive_node_count++;
            }
        }

        console.log("first_semester_values_list " + first_semester_values_list);
        
        if (first_semester_positive_node_count > 0) {
            var max_first_semester_value = Math.max(...first_semester_values_list); // destructuring assignment to extract data from arrays into distinct variables
            var max_first_semester_index = first_semester_values_list.findIndex(element => element == max_first_semester_value);
            first_schedule = get_path_from_first_semester_course_node_index(max_first_semester_index, all_semesters_list);
        }

        if (first_semester_positive_node_count > 1) {
            first_semester_values_list[max_first_semester_index] = -1; // replace the max value
            var second_max_first_semester_value = Math.max(...first_semester_values_list); // destructuring assignment to extract data from arrays into distinct variables
            var second_max_first_semester_index = first_semester_values_list.findIndex(element => element == second_max_first_semester_value);
            second_schedule = get_path_from_first_semester_course_node_index(second_max_first_semester_index, all_semesters_list);

        }

        if (first_semester_positive_node_count > 2) {
            first_semester_values_list[second_max_first_semester_index] = -1; // replace the max value
            var third_max_first_semester_value = Math.max(...first_semester_values_list); // destructuring assignment to extract data from arrays into distinct variables
            var third_max_first_semester_index = first_semester_values_list.findIndex(element => element == third_max_first_semester_value);
            third_schedule = get_path_from_first_semester_course_node_index(third_max_first_semester_index, all_semesters_list);
        }

        all_schedules_list = [first_schedule, second_schedule, third_schedule];
        return all_schedules_list;

        // let stack=[];
        // for(i = 0; i < all_semesters_list[0].length; i++){
        //     all_semesters_list[0][i].change_semester(0);
        //     stack.push(all_semesters_list[0][i]);
        // }

        // let scheduleList = [];
        // let numPath = 0;
        // while(stack.length > 0){
        //     let node = stack.pop();
        //     let curr_path = node.get_curr_path;
        //     curr_path.push(node); //curr path now contains the path up to the current node
        //     if(node.get_value == 1 && node.get_child_indices.length == 0){//if doesn't have child and can graduate, then it's a node of the last semester
        //         scheduleList.push(curr_path);
        //         numPath++;
        //     }
        //     let child_indices = node.get_child_indices;
        //     let semester = node.get_semester;
        //     for(j = 0; j < child_indices.length; j++){
        //         let child_index = child_indices[j];
        //         let child_node = all_semesters_list[semester+1][child_index];
        //         if(!child_node.ifVisited()){
        //             child_node.setVisited();
        //             child_node.set_path(curr_path); // child node now contains the path up to its parent
        //             child_node.change_semester(semester+1);
        //             stack.push(child_node);
        //         }
        //     }
        // }
    },
};

function get_path_from_first_semester_course_node_index(first_semester_index, all_semesters_list) {
    let schedule = [];

    schedule.push(all_semesters_list[0][first_semester_index]);
    let parent_index = first_semester_index;
    
    for (var i = 0; i < all_semesters_list.length - 1; i++) { // stop at the second last semester since we are extracting child nodes
        // find the best child node
        let child_indices_list = all_semesters_list[i][parent_index].get_child_indices;
        let child_values_list = [];
        for (var k = 0; k < child_indices_list.length; k++) {
            child_values_list.push(all_semesters_list[i+1][child_indices_list[k]].get_value); // get the child node value
        }

        let best_child_value = Math.max(...child_values_list); // destructuring assignment to extract data from arrays into distinct variables
        let best_child_index = child_values_list.findIndex(element => element == best_child_value); // only return the first max index

        // push the best child into the schedule
        schedule.push(all_semesters_list[i+1][best_child_index]);
        // child node becomes the parent node for next semester
        parent_index = best_child_index;
    }

    return schedule;
}


