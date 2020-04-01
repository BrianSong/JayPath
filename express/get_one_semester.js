const filter = require("./filter");

module.exports = {
    get_one_semester: function get_one_semester(prev_semester_nodes_list, field) {
        // input: list of course nodes at the previous semester
        // e.g.: [node(0,0,0,0)]
        // output: list of course nodes at the current semester
        // e.g.: [node(1,1,0,0), node(0,1,1,0)]
        let child_nodes = [];
        let child_node_idx = 0;

        let curr_semester_nodes_list = []; // store the course nodes for current semester

        // looping for all course nodes in the previous semester
        for (var i = 0; i < prev_semester_nodes_list.length; i++) {
            // generate a possible course node at the current semester
            // get a list of child nodes based on a given course node
            child_nodes = get_child_nodes(prev_semester_nodes_list[i], field)

            // add child course nodes in the current semester nodes list
            // note: make sure there is no duplicates!
            for (var j = 0; j < child_nodes.length; j++) {
                // check if the child node is in the current semester nodes list
                child_node_idx = curr_semester_nodes_list.findIndex(element => element == child_nodes[j])

                if (child_node_idx == -1) {
                    // add a new child node into the current semester nodes list
                    curr_semester_nodes_list.push(child_nodes[j])
                    // remember the child node index
                    prev_semester_nodes_list[i].add_child_index(curr_semester_nodes_list.length);
                } else {
                    // remember the child node index
                    prev_semester_nodes_list[i].add_child_index(child_node_idx);
                }
            }
        }
        return curr_semester_nodes_list;
    },
};

function get_child_nodes(course_node, field) {
    let course_status = course_node.get_status(); // e.g. [0,0,0,0]
    return filter.filterByPre(course_status, field, get_child_from_eligible) // for function callback
}

function get_child_from_eligible(eligible_courses) {
    let child_nodes = [];
    for (var i = 0; i < eligible_courses.length; i++) {
        eligible_courses[i]
    }
    
    return child_nodes;
}