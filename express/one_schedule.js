var course_node = require("./course_node");
var grad = require("./check_graduation");

module.exports = {
    get_schedule: function get_schedule(all_semesters_list, courseList) {
        // input: a list, where each element (corresponding to a term) is a list of course codes
        // output: a list of course nodes, where each course node is the courses to be taked at each semester

        let schedule_list = []; // store the best course nodes for every semesters
        if (all_semesters_list.length == 0) { return schedule_list; }

        for (var i = 0; i < all_semesters_list[all_semesters_list.length-1].length; i++) {
            let curr_node = all_semesters_list[all_semesters_list.length - 1][i];
            let g = grad.check(curr_node.get_status, courseList);
            if(g){
                curr_node.change_node_value(1);
            }else{
                curr_node.change_node_value(0);
            }
        }

        // looping backwards starting from the second to last semester
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

        let stack=[];
        for(i = 0; i < all_semesters_list[0].length; i++){
            all_semesters_list[0][i].change_semester(0);
            stack.push(all_semesters_list[0][i]);
        }

        let scheduleList = [];
        let numPath = 0;
        while(stack.length > 0){
            let node = stack.pop();
            let curr_path = node.get_curr_path;
            curr_path.push(node); //curr path now contains the path up to the current node
            if(node.get_value == 1 && node.get_child_indices.length == 0){//if doesn't have child and can graduate, then it's a node of the last semester
                scheduleList.push(curr_path);
                numPath++;
                if (numPath > 2) {
                    break;
                }else{
                    continue;
                }
            }
            let child_indices = node.get_child_indices;
            let semester = node.get_semester;
            for(j = 0; j < child_indices.length; j++){
                let child_index = child_indices[j];
                let child_node = all_semesters_list[semester+1][child_index];
                if(!child_node.ifVisited()){
                    child_node.setVisited();
                    child_node.set_path(curr_path); // child node now contains the path up to its parent
                    child_node.change_semester(semester+1);
                    stack.push(child_node);
                }
            }
        }

        return scheduleList;
    },
};
