const filter = require("./filter");
var course_node = require("./course_node");


module.exports = {
    get_one_semester: function get_one_semester(prev_semester_nodes_list, field, courses_track, courses_pre, courseList) {
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
            let child_nodes_list = get_child_nodes(prev_semester_nodes_list[i], field, courses_track, courses_pre, courseList);
            //console.log("prev node i = " + i + " child_nodes_list length: " + child_nodes_list.length);

            // add child course nodes in the current semester nodes list
            // note: make sure there is no duplicates!
            for (var j = 0; j < child_nodes_list.length; j++) {
                // check if the child node is in the current semester nodes list
                let child_node_idx = curr_semester_nodes_list.findIndex(element => child_nodes_list[j].equals(element))

                // let child_node_idx = -1
                // for (var k = 0; k < curr_semester_nodes_list.length; k++) {
                //     if (curr_semester_nodes_list[k].get_status == child_nodes_list[j].get_status) {
                //         child_node_idx = k;
                //         break;
                //     }
                // }

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
            //console.log("prev node i = " + i + " child_indices length: " + prev_semester_nodes_list[i].get_child_indices.length);
        }
        console.log("curr_semester_nodes_list length: " + curr_semester_nodes_list.length);
        return curr_semester_nodes_list;
    }
};

function get_child_nodes(prev_course_node, field, courses_track, courses_pre, courseList) {
    let prev_course_status = prev_course_node.get_status;
    // need field, courseList
    let eligible_courses = filter.filterByPre(prev_course_status, field, courseList);
    let eligible_ids = [];
    for(var i = 0; i < eligible_courses.length; i++){
        eligible_ids.push(eligible_courses[i].id);
    }
    let child_nodes_list = select_from_eligible(prev_course_status, eligible_ids);
    return child_nodes_list;
}

function select_from_eligible(prev_course_status, eligible_ids) {
    let child_nodes_list = []
    if (eligible_ids.length == 0) { return child_nodes_list }

    let all_conflict_strings = ["3-25-38-19-8-26-16-23-27-33-42", "", "41", "25-38-0", "14-15-17-36-44", "11-12-13-45", "18-29-34-39", "40-9-20-24-28", "19-26-16-23-27-33-42-0", "7-40-20-24-28", "", "5-12-13-45-23", "5-6-11-13-18-29-34-39-45", "5-11-12-45", "4-15-17-36-44", "4-6-14-17-18-29-34-36-39-44", "19-8-26-23-27-33-42-0", "4-14-15-44", "6-12-29-34-45-39-15", "8-26-16-23-27-33-42-0", "7-40-9-24-28", "30-46", "", "19-8-26-16-0-33-42-0-11", "7-40-9-20-28", "3-38-0", "19-8-16-23-27-33-42-0", "19-8-26-16-23-33-42-0", "7-40-9-20-24", "6-19-34-39", "21-46", "", "", "19-8-26-16-23-27-42-0", "6-18-29-39", "", "4-14-15-44", "43", "3-25-0", "6-12-15-18-29-34-45", "7-9-20-24-28", "2", "19-8-26-16-23-27-33-0", "37", "4-14-15-17-36", "5-6-11-12-13-15-18-29-34-39", "21-30"];

    let eligible_ids_str = []; // eligible course ids in a list of strings format
    let conflict_ids_str = []; // conflict course ids for each eligible course in a list of list of strings format
    for (let i = 0; i < eligible_ids.length; i++) {
        eligible_ids_str.push(eligible_ids[i].toString());
        conflict_ids_str.push(all_conflict_strings[i].split("-"));
    }

    // select no conflict courses based on just ids
    // TODO: can be improved by using sublist removing!!!


    // randome(i,j,k) -> child

    for (var i = 0; i < eligible_ids_str.length; i++) {
        let course1_id = eligible_ids_str[i];

        for (var j = i + 1; j < eligible_ids_str.length; j++) {
            let course2_id = eligible_ids_str[j];
            if (conflict_ids_str[i].includes(course2_id)) { continue; }

            for (var k = j + 1; k < eligible_ids_str.length; k++) {
                let course3_id = eligible_ids_str[k];
                if (conflict_ids_str[i].includes(course3_id)) { continue; }
                if (conflict_ids_str[j].includes(course3_id)) { continue; }

                let child_course_status = prev_course_status.slice(); // copy by value, not by reference!!!
                child_course_status[parseInt(course1_id)] = 1;
                child_course_status[parseInt(course2_id)] = 1;
                child_course_status[parseInt(course3_id)] = 1;

                let child_node = new course_node(child_course_status);
                child_nodes_list.push(child_node);

                if (child_nodes_list.length == 2) { return child_nodes_list; }
            }
        }
        return child_nodes_list;
    }
}