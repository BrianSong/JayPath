module.exports =  class course_node {
  constructor(course_status) {
    this.status = course_status;
    this.value = 0; // not used for iter3
    this.child_indices = []; // not used for iter3
    this.best_child_index = -1; // not used for iter3
  }

  equals(another_course_node){
      for(let i = 0; i < another_course_node.status.length; i++){
          if(another_course_node.status[i] != this.status[i]){
              return false;
          }
      }
      return true;
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

  // setter
  set set_status(course_status) {
  	this.status = course_status;
  }

  set set_value(node_value) {
  	this.value = node_value;
  }

  set add_child_index(index) {
  	this.child_indices.push(index);
  }

  set set_best_child_index(index) {
  	this.best_child_index = index;
  }
};
