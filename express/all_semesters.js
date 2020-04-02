const one_semester = require("./one_semester");

module.exports = {
    get_all_semesters: function get_all_semesters(user_semester, field) {
        // input: user course nodes list (a list contains a single course node)
        // output: a list where each element (corresponding to a term) is a list of course codes

        let all_semesters = []; // every element is a list of courses for a term

        // get the very next semester nodes based on the user nodes list
        let curr_semester_nodes_list = one_semester.get_one_semester(user_semester, field);
        
        // note: check graduation before push to all semesters to make sure values are assigned
        // check graudation and assign values (pass by reference in order to modify input?)
        // let grad_flag = check_grad(curr_semester_nodes_list, field); // not used for iter3
        let grad_flag = false;

        // add the current semester nodes list into the all semesters list
        all_semesters.push(curr_semester_nodes_list);

        while (!grad_flag) { // not graduate yet, need to take one more semester
            // get the next semester nodes
            curr_semester_nodes_list = one_semester.get_one_semester(all_semesters[-1], field); // only need to input the most recent semester

            // check graudation and assign values (pass by reference in order to modify input?)
            // grad_flag = check_grad(curr_semester_nodes_list, field); // not used for iter3

            // add the current semester nodes list into the all semesters list
            all_semesters.push(curr_semester_nodes_list);

            if (all_semesters.length == 8) { break; } // only for iter3!!!
       }

       return all_semesters; // note all the nodes should have values assinged, but only the last semester has value 1 and matters
    },
};

function check_grad(nodes_list, field){
    let grad_flag = false;
    let curr_node_status = [];

    // looping over all course nodes
    for (var i = 0; i < nodes_list.length; i++) {
        // assing value by checking graduation requirement, pass: 1; fail: -1
        curr_node_status = nodes_list[i].get_status();
        
        // check core requirement

        // check total credits requirement

        // check field requirement

        // node_value = 0;
        // nodes_list[i].set_value() = node_value;

        if (node_value == 1) {
            grad_flag = true; // do not break since we need to assign values to all nodes
        }
    }

    return grad_flag;
}