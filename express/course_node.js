module.exports =  class course_node {
  constructor(course_status) {
    this.status = course_status;
    this.value = -1; // not used for iter3
    this.child_indices = []; // not used for iter3
    this.best_child_index = -1; // not used for iter3
    this.semester = 0;
  }

  equals(another_course_node){
    return (another_course_node.get_status == this.status);
  }

  get get_semester(){
    return this.semester;
  }

  // getter
  get get_status() {
  	return this.status;
  }

  get get_value() {
  	return this.value;
  }

  get get_child_indices() {
  	return this.child_indices;
  }

  get get_best_child_index() {
  	return this.best_child_index;
  }

  add_one_child(index) {
    this.child_indices.push(index);
  }

  change_node_value(node_value) {
    this.value = node_value;
  }

  change_semester(s){
    this.semester = s;
  }

  set_best_child_index(index) {
    this.best_child_index = index;
  }
};