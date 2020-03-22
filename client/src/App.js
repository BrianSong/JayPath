import React, { Component } from "react";
import logo from "./logo.svg";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";


class App extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    }
  
    render() {
      return (
        <Router>
          <Switch>
            <Route exact path="/">
              <CoursesTaken />
            </Route>
            <Route exact path="/focus_area">
              <FocusArea />
            </Route>
            <Route exact path="/nlp">
              <NLP />
            </Route>
            <Route exact path="/r">
              <ROB />
            </Route>
            <Route exact path="/bd">
              <BD />
            </Route>
            <Route exact path="/is">
              <IS />
            </Route>
            <Route exact path="/cb">
              <CB />
            </Route>
          </Switch>
        </Router>
      );
    }
  }


class CoursesTaken extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      question: "What courses have you taken?",
      value: "", // for display in the input box
      allCourses: ["hello", "bye"], 
      myCourses: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  callAPI() {
    console.log("fetching from api");
    fetch("http://localhost:5000/api/courses") // to be changed
      .then(res => res.json())
      .then(res => this.setState({ allCourses: res }))
      .catch(err => err);
  }

  sendAPI(data) {
    console.log("posting to api");
    console.log(JSON.stringify(data));
    fetch('http://localhost:5000/api/user_info', {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(res => res.json())
    .then(data => console.log("Success", data))
    .catch(err => console.log("Error:", err));
  }

  // showData(data) {
  //   console.log(JSON.stringify(data))
  // }

  componentDidMount() {
    this.callAPI();
  }

  handleChange(event) {
    this.setState({value: event.target.value}); // prints input out by setting values to the changes
  }

  handleSubmit(event) {
    alert('Successfully added ' + this.state.value + '!');
    this.setState(state => {
      const myCourses = state.myCourses.concat(state.value);
      return {
        value:"",
        myCourses,
      };
    });
    event.preventDefault();
  }


  render() {
      const optionList = this.state.allCourses.map(it => 
              <option>
                {it.CourseTitle}
              </option>
              );
        console.log("OPTION:",optionList)

      return (
        <div class="center">
          <h1
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {this.state.question}
          </h1>
          <form onSubmit={this.handleSubmit} style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
            <label style={{color:"blue"}}> <i class="iconfont">&#xe600;</i>Choose your course from the list below
            <div>
            <select id="courses" value={this.state.value} onChange = {this.handleChange}>
            <option value="">Select Your Courses </option>
  {optionList}
</select> 
</div>
<input class = "button_t" type="submit" value="I've taken it!" />
</label>
          </form>
          <div>{this.state.myCourses.map(data => (<li>{data}</li>))}</div>

          {/* <label>
    Choose a course from this list:
   <input list="courses" id="prereq" autoComplete = "on"/>  
</label>    */}
 

<Link to="/focus_area">
              <button onClick = {() => this.sendAPI(this.state.myCourses)} class="button0" type="button">
                THAT'S IT!
              </button>
              <i class="iconfont" style={{position: "absolute", right: "40px"}}>&#xe627;</i>
          </Link>


        </div>
        
    );
  }
}



// class Dropdown extends Component {
//     constructor(prop) {
//       super(prop);
//       this.state = {
//         question: "What is your focus area in computer science?",
//         schedule: []
//       };
//     }
  
//     callAPI() {
//       console.log("fetching from api");
//       fetch("http://localhost:5000/api/nlp/courses") //to be changed
//         .then(res => res.json())
//         .then(res => this.setState({ schedule: res }))
//         .catch(err => err);
//     }
  
//     componentDidMount() {
//       this.callAPI();
//     }
//   }
  
  class FocusArea extends Component {
    constructor(prop) {
      super(prop);
      this.state = {
        question: "What is your focus area in computer science?"
        // later on may want to add componentDidMount() to read focus areas from the DB
      };
    }
  
    render() {
      return (
        <div class="center">
          <h1
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {this.state.question}
          </h1>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              justifyContent: "center"
            }}
          >
          <Link to="/r">
            <button class="button1" type="button">
              Robotics
            </button>
          </Link>
          <Link to="/bd">
            <button class="button4" type="button">
              Big Data
            </button>
          </Link>
          <Link to="/is">
            <button class="button5" type="button">
              Information Security
            </button>
          </Link>
          <Link to="/cb">
            <button class="button3" type="button">
              Computational Biology
            </button>
          </Link>
          <Link to="/nlp">
            <button class="button2" type="button">
              Natural Language Processing
            </button>
          </Link>
          </div>
        </div>
      );
    }
  }
  
  
  class NLP extends Component {
    constructor(prop) {
      super(prop);
      this.state = {
        apiResponse: "",
        schedule: []
      };
    }
  
    callAPI() {
      console.log("fetching from api");
      fetch("http://localhost:5000/api/nlp/courses")
        .then(res => res.json())
        .then(res => this.setState({ schedule: res }))
        .catch(err => err);
    }
  
    componentDidMount() {
      this.callAPI();
    }
  
    render() {
      const listItems = this.state.schedule.map(d => {
        return (
          <li>
            {d.CourseNumber}
            {": "}
            {d.CourseTitle}
            {" Credit:"}
            {d.Credits}
            {" Instructor:"}
            {d.Instructor}
          </li>
        );
      });
      return (
        <div class="center1">
          <h1
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            Welcome to Natural Language Processing!
          </h1>
          <div>{listItems}</div>
        </div>
      );
    }
  }
  
  class CB extends Component {
    constructor(prop) {
      super(prop);
      this.state = {
        schedule: []
      };
    }
  
    callAPI() {
      fetch("http://localhost:5000/api/cb/courses")
        .then(res => res.json())
        .then(res => this.setState({ schedule: res }))
        .catch(err => err);
    }
  
    componentDidMount() {
      this.callAPI();
    }
  
    render() {
      const listItems = this.state.schedule.map(d => {
        return (
          <li>
            {d.CourseNumber}
            {": "}
            {d.CourseTitle}
            {" Credit:"}
            {d.Credits}
            {" Instructor:"}
            {d.Instructor}
          </li>
        );
      });
      return (
        <div>
          <h1
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            Welcome to Computational Biology!
          </h1>
          <div>{listItems}</div>
        </div>
      );
    }
  }
  
  class IS extends Component {
    constructor(prop) {
      super(prop);
      this.state = {
        apiResponse: "",
        schedule: []
      };
    }
  
    callAPI() {
      fetch("http://localhost:5000/api/is/courses")
        .then(res => res.json())
        .then(res => this.setState({ schedule: res }))
        .catch(err => err);
    }
  
    componentDidMount() {
      this.callAPI();
    }
  
    render() {
      const listItems = this.state.schedule.map(d => {
        return (
          <li>
            {d.CourseNumber}
            {": "}
            {d.CourseTitle}
            {" Credit:"}
            {d.Credits}
            {" Instructor:"}
            {d.Instructor}
          </li>
        );
      });
      return (
        <div>
          <h1
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            Welcome to Information Securities!
          </h1>
          <div>{listItems}</div>
        </div>
      );
    }
  }
  
  class ROB extends Component {
    constructor(prop) {
      super(prop);
      this.state = {
        apiResponse: "",
        schedule: []
      };
    }
  
    callAPI() {
      fetch("http://localhost:5000/api/r/courses")
        .then(res => res.json())
        .then(res => this.setState({ schedule: res }))
        .catch(err => err);
    }
  
    componentDidMount() {
      this.callAPI();
    }
  
    render() {
      const listItems = this.state.schedule.map(d => {
        return (
          <li>
            {d.CourseNumber}
            {": "}
            {d.CourseTitle}
            {" Credit:"}
            {d.Credits}
            {" Instructor:"}
            {d.Instructor}
          </li>
        );
      });
      return (
        <div>
          <h1
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            Welcome to Robotics!
          </h1>
          <div>{listItems}</div>
        </div>
      );
    }
  }
  
  class BD extends Component {
    constructor(prop) {
      super(prop);
      this.state = {
        apiResponse: "",
        schedule: []
      };
    }
  
    callAPI() {
      fetch("http://localhost:5000/api/bd/courses")
        .then(res => res.json())
        .then(res => this.setState({ schedule: res }))
        .catch(err => err);
    }
  
    componentDidMount() {
      this.callAPI();
    }
  
    render() {
      const listItems = this.state.schedule.map(d => {
        return (
          <li>
            {d.CourseNumber}
            {": "}
            {d.CourseTitle}
            {" Credit:"}
            {d.Credits}
            {" Instructor:"}
            {d.Instructor}
          </li>
        );
      });
      return (
        <div>
          <h1
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            Welcome to Big Data!
          </h1>
          <div>{listItems}</div>
        </div>
      );
    }
  }
  
  export default App;