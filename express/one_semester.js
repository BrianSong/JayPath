const filter = require("./filter");
var course_node = require("./course_node");
const init = require("./initial");


module.exports = {
    get_one_semester: function get_one_semester(prev_semester_nodes_list, field, term) {
        // input: list of course nodes at the previous semester
        // e.g.: [node(0,0,0,0)]
        // output: list of course nodes at the current semester
        // e.g.: [node(1,1,0,0), node(0,1,1,0)]

        console.log("prev_semester_nodes_list length: " + prev_semester_nodes_list.length);
        let curr_semester_nodes_list = []; // store the course nodes for current semester

        // looping for all course nodes in the previous semester
        for (var i = 0; i < prev_semester_nodes_list.length; i++) {
            // generate a possible course node at the current semester
            // get a list of child nodes based on a given course node
            let child_nodes_list = get_child_nodes(prev_semester_nodes_list[i], field, term);
            // console.log("number of childs: " + child_nodes_list.length);

            // add child course nodes in the current semester nodes list
            // note: make sure there is no duplicates!
            for (var j = 0; j < child_nodes_list.length; j++) {
                // check if the child node is in the current semester nodes list
                let child_node_idx = curr_semester_nodes_list.findIndex(element => child_nodes_list[j].equals(element));
                if (child_node_idx == -1) {
                    // add a new child node into the current semester nodes list
                    curr_semester_nodes_list.push(child_nodes_list[j]);
                    // remember the child node index
                    prev_semester_nodes_list[i].add_one_child(curr_semester_nodes_list.length - 1);
                } else {
                    // remember the child node index
                    prev_semester_nodes_list[i].add_one_child(child_node_idx);
                }
            }
        }
        console.log("cur_semester_nodes_list length: " + curr_semester_nodes_list.length);
        return curr_semester_nodes_list;
    }
};

function get_child_nodes(prev_course_node, field, term) {
    let prev_course_status = prev_course_node.get_status;
    let eligible_courses = filter.filterByPre(prev_course_status, field, term);
    let child_nodes_list = select_from_eligible(prev_course_status, eligible_courses);
    return child_nodes_list;
}

function select_from_eligible(prev_course_status, eligible_courses) {
    // output: list of course nodes
    let child_nodes_list = [];
    if (eligible_courses.length == 0) { return child_nodes_list }
    let count = 0;

    for (let i = 0; i < eligible_courses.length; i++) {
        let course1_conflict_ids_str = eligible_courses[i].Conflicts.split("-");
        let conflict_ids = new Set();
        for(s of course1_conflict_ids_str){
            conflict_ids.add(parseInt(s));
        }

        for (let j = i + 1; j < eligible_courses.length; j++) {
            if(conflict_ids.has(eligible_courses[j].id)){continue;}

            let course2_conflict_ids_str = eligible_courses[j].Conflicts.split("-");
            let conflict_ids_2 = new Set();
            for(s of course2_conflict_ids_str){
                conflict_ids_2.add(parseInt(s));
            }

            for (let k = j + 1; k < eligible_courses.length; k++) {
                if(conflict_ids.has(eligible_courses[k].id) || conflict_ids_2.has(eligible_courses[k].id)){continue;}
                // Now we have found three courses that doesn't conflict
                // Need a new courseStatus
                let course_status_new = new Map();
                for(let c of prev_course_status.keys()){
                    course_status_new.set(c, prev_course_status.get(c));
                    if(c.id == eligible_courses[i].id || c.id == eligible_courses[j].id || c.id == eligible_courses[k].id){
                        course_status_new.set(c, 1);
                    }
                }

                let course_node_new = new course_node(course_status_new);
                child_nodes_list.push(course_node_new);
                count++;
                if(count > 3){ // can generate 5 child nodes currently
                    i = Number.MAX_VALUE;
                    j = Number.MAX_VALUE;
                    k = Number.MAX_VALUE;
                }
            }
        }
        return child_nodes_list;
    }
}

function compareNode(node1, node2){
    for(let k in node1.status.keys()){
        console.log("----");
        console.log(node2.get_status.get(k));
        console.log(node1.status.get(k));
        if(node1.status.get(k) != node2.get_status.get(k)){
            return false;
        }
    }
    return true;
}