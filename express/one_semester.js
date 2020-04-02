const filter = require("./filter");

module.exports = {
    get_one_semester: function get_one_semester(prev_semester_nodes_list, field) {
        // input: list of course nodes at the previous semester
        // e.g.: [node(0,0,0,0)]
        // output: list of course nodes at the current semester
        // e.g.: [node(1,1,0,0), node(0,1,1,0)]
        console.log("called");
        console.log(prev_semester_nodes_list.length);
        let curr_semester_nodes_list = []; // store the course nodes for current semester

        // looping for all course nodes in the previous semester
        for (var i = 0; i < prev_semester_nodes_list.length; i++) {
            console.log("entered the loop");
            // generate a possible course node at the current semester
            // get a list of child nodes based on a given course node
            console.log(prev_semester_nodes_list[i].get_status);
            let child_nodes = get_child_nodes(prev_semester_nodes_list[i], field);
            console.log(child_nodes);

            // add child course nodes in the current semester nodes list
            // note: make sure there is no duplicates!
            for (var j = 0; j < child_nodes.length; j++) {
                // check if the child node is in the current semester nodes list
                let child_node_idx = curr_semester_nodes_list.findIndex(child_nodes[j].equals);

                if (child_node_idx == -1) {
                    // add a new child node into the current semester nodes list
                    curr_semester_nodes_list.push(child_nodes[j]);
                    // remember the child node index
                    // prev_semester_nodes_list[i].add_child_index(curr_semester_nodes_list.length-1); // not used for iter3
                } else {
                    // remember the child node index
                    // prev_semester_nodes_list[i].add_child_index(child_node_idx);  // not used for iter3
                }
            }
        }
        return curr_semester_nodes_list;
    }
};

function get_child_nodes(prev_course_node, field) {
    let prev_course_status = prev_course_node.get_status;
    return filter.filterByPre(prev_course_status, field, select_from_eligible); // for function callback
}

function select_from_eligible(prev_course_status, eligible_courses) {
    console.log("select_from_eligible called");
    // extract useful information
    let eligible_ids = []; // course id for each eligible course, e.g.: [1,2,5]
    let conflict_ids = []; // course id of conflict courses for each eligible course, e.g.: [[2,3], [1], []]
    for (let i = 0; i < eligible_courses.length; i++) {
        eligible_ids.push(eligible_courses[i].id);
        // let conflict_string = eligible_courses[i].Conflict;
        // conflict_ids.push(conflict_string.toString().split("-"));
    }

    // select no conflict courses based on just ids
    // TODO: can be improved by using sublist removing!!!
    let child_nodes = [];
    for (var i = 0; i < eligible_ids.length; i++) {
        let course1_id = eligible_ids[i];

        for (var j = i + 1; i < eligible_ids.length; j++) {
            let course2_id = eligible_ids[j];
            if (conflict_ids[i].includes(course2_id)) {
                continue;
            }

            for (var k = j + 1; k < eligible_ids.length; k++) {
                let course3_id = eligible_ids[k];
                if (conflict_ids[i].includes(course3_id)) {
                    continue;
                }
                if (conflict_ids[j].includes(course3_id)) {
                    continue;
                }

                let child_course_status = prev_course_status;
                child_course_status[course1_id] = 1;
                child_course_status[course2_id] = 1;
                child_course_status[course3_id] = 1;
                let child_node = new course_node(child_course_status);
                child_nodes.push(child_node);
            }
        }
    }
    return child_nodes;
}