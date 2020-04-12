import React, { Component } from "react";
import logo from "./logo.svg";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import Autosuggest from 'react-autosuggest';
import NLP from "./NLP.js";
import ROB from "./ROB.js";
import BD from "./BD.js";
import IS from "./IS.js";
import CB from "./CB.js";


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
            <Route exact path="/current_semester">
              <SemestersTaken />
            </Route>
            <Route exact path="/focus_area">
              <FocusArea />
            </Route>
            <Route exact path="/final">
              <ROB valueFromParent='/rob'/>
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

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  handleClick = (event) => {
    this.setState({
      value: this.state.options.indexOf(event.target.value)
    });
  };

  render() {
    const opts = this.state.options.map((opt) => {
      return <button100
              value= {opt}
              class="square" 
              tabindex="0"
              onClick={e => this.handleClick(e)}>
              {opt}
              </button100>
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
          <button onClick = {() => this.sendAPI(this.state.value)} class="button0" type="button">
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
        value: 0
      };
    }
    handleClick = (event) => {
      this.setState({
        value: event.target.value
      });

    };

    render() {
      const opts = this.state.options.map((opt) => {
        return (
          <Link to="/final">
          <button value={opt.redirect} class={opt.class} type="button" onClick={e => this.handleClick(e)}>
            {opt.name}
          </button>
          </Link>
        )
      });
      
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
          >{opts}</div>
        
          {/* TO DO: 1. pass self.state.value to parent class; 2. completion picture */}
        </div>
      );
    }
  }

  

export default App;