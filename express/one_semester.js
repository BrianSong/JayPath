const filter = require("./filter");
let course_node = require("./course_node");

module.exports = {
    get_one_semester: function get_one_semester(prev_semester_nodes_list, field) {
        // input: list of course nodes at the previous semester
        // e.g.: [node(0,0,0,0)]
        // output: list of course nodes at the current semester
        // e.g.: [node(1,1,0,0), node(0,1,1,0)]
        let curr_semester_nodes_list = []; // store the course nodes for current semester

        // looping for all course nodes in the previous semester
        for (var i = 0; i < prev_semester_nodes_list.length; i++) {
            // generate a possible course node at the current semester
            // get a list of child nodes based on a given course node
            let child_nodes = select_from_eligible(prev_semester_nodes_list[i].get_status);
            console.log("child_nodes length: " + child_nodes.length);

            // add child course nodes in the current semester nodes list
            // note: make sure there is no duplicates!
            for (var j = 0; j < child_nodes.length; j++) {
                // check if the child node is in the current semester nodes list
                let child_node_idx = -1;

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

function select_from_eligible(prev_course_status) {
    console.log(prev_course_status);
    // extract useful information
    let courses_conflict = ["3-25-38-19-8-26-16-23-27-33-42", "", "41", "25-38-0", "14-15-17-36-44", "11-12-13-45", "18-29-34-39", "40-9-20-24-28", "19-26-16-23-27-33-42-0", "7-40-20-24-28", "", "5-12-13-45-23", "5-6-11-13-18-29-34-39-45", "5-11-12-45", "4-15-17-36-44", "4-6-14-17-18-29-34-36-39-44", "19-8-26-23-27-33-42-0", "4-14-15-44", "6-12-29-34-45-39-15", "8-26-16-23-27-33-42-0", "7-40-9-24-28", "30-46", "", "19-8-26-16-0-33-42-0-11", "7-40-9-20-28", "3-38-0", "19-8-16-23-27-33-42-0", "19-8-26-16-23-33-42-0", "7-40-9-20-24", "6-19-34-39", "21-46", "", "", "19-8-26-16-23-27-42-0", "6-18-29-39", "", "4-14-15-44", "43", "3-25-0", "6-12-15-18-29-34-45", "7-9-20-24-28", "2", "19-8-26-16-23-27-33-0", "37", "4-14-15-17-36", "5-6-11-12-13-15-18-29-34-39", "21-30"];
    let eligible_ids = []; // course id for each eligible course, e.g.: [1,2,5]
    for(let t = 0; t < 25; t++){
        if(!prev_course_status.includes(t)){
            eligible_ids.push(t);
        }
    }
    let conflict_ids = []; // course id of conflict courses for each eligible course, e.g.: [[2,3], [1], []]
    for (let i = 0; i < eligible_ids.length; i++) {
        let conflict_string = courses_conflict[eligible_ids[i]].split("-");
        conflict_ids.push(conflict_string);
    }

    // select no conflict courses based on just ids
    // TODO: can be improved by using sublist removing!!!
    let child_nodes = [];
    let count = 0;
    for (var i = 0; i < eligible_ids.length; i++) {
        //console.log("i is: "+ i);
        let course1_id = eligible_ids[i].toString();

        for (var j = i + 1; j < eligible_ids.length; j++) {
            //console.log("j is:" + j);
            let course2_id = eligible_ids[j].toString();
            if (conflict_ids[i].includes(course2_id)) {
                continue;
            }

            for (var k = j + 1; k < eligible_ids.length; k++) {
                //console.log("k is:" + k);
                let course3_id = eligible_ids[k].toString();
                if (conflict_ids[i].includes(course3_id)) {
                    continue;
                }
                if (conflict_ids[j].includes(course3_id)) {
                    continue;
                }

                let child_course_status = prev_course_status;
                child_course_status[parseInt(course1_id)] = 1;
                child_course_status[parseInt(course2_id)] = 1;
                child_course_status[parseInt(course3_id)] = 1;
                let child_node = new course_node(child_course_status);
                child_nodes.push(child_node);
                //console.log("found one child");
                count++;
                // if(count > 10){
                //     break;
                // }
            }
        }
    }
    return child_nodes;
}