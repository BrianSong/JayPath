module.exports = {
    get_all_semesters: function get_all_semesters(user_semester) {
        // input: user course nodes list (a list contains a single course node)
        // output: a list where each element (corresponding to a term) is a list of course codes

        let all_semesters = []; // every element is a list of courses for a term

        // get the very next semester nodes based on the user nodes list
        let curr_semester_nodes_list = get_one_semester(user_semester);
        
        // note: check graduation before push to all semesters to make sure values are assigned
        // check graudation and assign values (pass by reference in order to modify input?)
        let grad_flag = check_grad(curr_semester_nodes_list);

        // add the current semester nodes list into the all semesters list
        all_semesters.push(curr_semester_nodes_list);

        while (!grad_flag) { // not graduate yet, need to take one more semester
            // get the next semester nodes
            curr_semester_nodes_list = get_one_semester(all_semesters[-1]); // only need to input the most recent semester

            // check graudation and assign values (pass by reference in order to modify input?)
            grad_flag = check_grad(curr_semester_nodes_list);

            // add the current semester nodes list into the all semesters list
            all_semesters.push(curr_semester_nodes_list);
       }

       return all_semesters; // note all the nodes should have values assinged, but only the last semester has value 1 and matters
    },
};

function check_grad(nodes_list){
    let grad_flag = false;
    let curr_node_status = [];
    let node_value = 0;

    for (var i = 0; i < nodes_list.length; i++) {
        // assing value by comparing nodes list with graduation course status
        // pass: 1; fail: -1
        curr_node_status = nodes_list[i].get_status();
        node_value = compare_grad_status(curr_node_status, grad_course_status)
        nodes_list[i].set_value() = node_value;

        if (node_value == 1) {
            grad_flag = true; // do not break since we need to assign values to all nodes
        }
    }

    return grad_flag;
}

function compare_grad_status(course_status, grad_course_status){
    for (var i = 0; i < course_status.length; i++) {
        if ((course_status[i] == 0) && (grad_course_status[i] == 1)){
            return -1;
        }
    }
    return 1;
}