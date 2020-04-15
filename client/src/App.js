import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import Autosuggest from 'react-autosuggest';
import Final from "./Final.js";
import FailingPage from "./FailingPage.js";


class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        focus_area: '/aa',
        semesters_taken: -2
      };
    }

    parentFunction = (data_from_child) => {
      this.setState({
        focus_area: data_from_child
      });
    };

    parentFunction2 = (data_from_child) => {
      this.setState({
        semesters_taken: data_from_child
      });
    };

    render() {
      return (
        <Router>
            <Route exact path="/" component={CoursesTaken} />
            <Route exact path="/oops" component = {FailingPage} />
            <Route exact path="/current_semester" render={(props) => <SemestersTaken {...props} functionCallFromParent={this.parentFunction2.bind(this)} />} />
            <Route exact path="/focus_area" render={(props) => <FocusArea {...props} functionCallFromParent={this.parentFunction.bind(this)} />}/>
            <Route exact path="/final" render={(props) => <Final {...props} valueFromParent={this.state.focus_area} valueFromParent2={this.state.semesters_taken}/>} />
            <Route exact path="/advising" component={() => { window.location.href = 'https://advising.jhu.edu/'; return null;}}></Route>
            <Route exact path="/cs_req" component={() => { window.location.href = 'http://e-catalog.jhu.edu/departments-program-requirements-and-courses/engineering/computer-science/'; return null;}}></Route>
        </Router>
      );
    }
  }



class CoursesTaken extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      question: "What courses have you taken?",
      value: '',
      finalValue: '',
      suggestions: [],
      allCourses: [],
      myCourses: []
    };
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
      mode: 'no-cors',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
    .then(data => console.log("Success", data))
    .catch(err => console.log("Error:", err));
  }

  componentDidMount() {
    this.callAPI();
  }

  // Teach Autosuggest how to calculate suggestions for any given input value.
  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
  
    return inputLength === 0 ? [] : this.state.allCourses.filter(ac =>
      ac.CourseTitle.toLowerCase().slice(0, inputLength) === inputValue
    );
  };
  
  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  getSuggestionValue = suggestion => suggestion.CourseTitle;
  
  // Use your imagination to render suggestions.
  renderSuggestion = (suggestion, { query, isHighlighted }) => (
    <span>
      {suggestion.CourseTitle}
    </span>
  );

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({ value }) => {
      this.setState({
        suggestions: this.getSuggestions(value)
      });
    };
  
    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
      this.setState({
        suggestions: []
      });
    };

    onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
      if (this.state.myCourses.includes(suggestionValue)) {
        alert(suggestionValue + ' added already. Add a different course!');
      } else {
        alert('Successfully added ' + suggestionValue + '!');
        const updatedCourses = this.state.myCourses.concat(suggestionValue);
        this.setState({
          myCourses: updatedCourses,
          value: ""
        });
      }
      
    }

  render() {
      const { value, suggestions } = this.state;
  
      // Autosuggest will pass through all these props to the input.
      const inputProps = {
        placeholder: 'course name',
        value,
        onChange: this.onChange
      };
      
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
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          onSuggestionSelected= {this.onSuggestionSelected}
          //renderSuggestionsContainer={this.renderSuggestionsContainer}
          inputProps={inputProps}
        />
        <div>{this.state.myCourses.map(data => (<li>{data}</li>))}</div>
 
        <Link to="/current_semester">
            <button onClick = {() => this.sendAPI(this.state.myCourses)} class="button0" type="button">
              THAT'S IT!
            </button>
            <i class="iconfont" style={{position: "absolute", right: "40px"}}>&#xe627;</i>
         </Link>
        
        </div>
    );
  }
}

class SemestersTaken extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      question: "Which of the following best describes your current semester(or the one you just completed)?",
      value: 0,
      options: ['semester 1', 'semester 2',
      'semester 3', 'semester 4',
      'semester 5', 'semester 6',
      'semester 7', 'semester 8']
    };
  }

  sendAPI = () => {
    console.log("posting to api");
    console.log(JSON.stringify(this.state.value));
    fetch('http://localhost:5000/api/user_info', {
      mode: 'no-cors',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(this.state.value)
    }).then(res => res.json())
    .then(data => console.log("Success", data))
    .catch(err => console.log("Error:", err));

    // passing user input value to parent component App
    console.log(this.state.value);
    this.props.functionCallFromParent(this.state.value);
  };

  handleClick = (event) => {
    this.setState({
      value: this.state.options.indexOf(event.target.value)
    });
  };

  render() {
    const opts = this.state.options.map((opt) => {
      return <button
              value= {opt}
              class="button100"
              tabindex="0"
              onClick={e => this.handleClick(e)}>
              {opt}
              </button>
    });
  
    return (
      <div class="center">
        <h1
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
          {this.state.question}
        </h1>
        <div class = "container1">{opts}</div>

        <Link to="/focus_area">
          <button onClick = {this.sendAPI.bind(this)} class="button0" type="button">
            THAT'S IT!
          </button>
          <i class="iconfont" style={{position: "absolute", right: "40px"}}>&#xe627;</i>
          </Link>
        </div>
        
    );
  }
}

  class FocusArea extends Component {
    constructor(prop) {
      super(prop);
      this.state = {
        question: "What is your focus area in computer science?",
        // later on may want to add componentDidMount() to read focus areas from the DB
        options: [
          {name: 'Robotics', redirect: '/rob', class: 'button1'},
          {name: 'Big Data', redirect: '/bd', class: 'button4'},
          {name: 'Information Security', redirect:'/is', class: 'button5'},
          {name: 'Computational Biology', redirect: '/cb', class: 'button3'},
          {name: 'Natural Language Processing', redirect: '/nlp', class: 'button2'}
        ],
        value: ''
      };
    }
    
    handleClick = (event) => {
      this.setState({
        value: event.target.value
      });
    };

    // passing user input value to parent component App
    sendFA = () => {
      console.log(this.state.value);
      //e.preventDefault();
      this.props.functionCallFromParent(this.state.value);
    };

    

    render() {
      const opts = this.state.options.map((opt) => {
        return <button
                value= {opt.redirect}
                class={opt.class}
                tabindex="0"
                onClick={e => this.handleClick(e)}>
                {opt.name}
                </button>
      });
    
      return (
        <div class="center">
          <h1
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
            {this.state.question}
          </h1>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              justifyContent: "center"
            }}
          >{opts}</div>
  
          <Link to="/oops">
            <button onClick = {this.sendFA.bind(this)} class="button0" type="button">
              VIEW MY PATH!
            </button>
            <i class="iconfont" style={{position: "absolute", right: "40px"}}>&#xe627;</i>
          </Link>
          </div>
      );
    }
  }
export default App;