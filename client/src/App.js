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
    // console.log(JSON.stringify(data));
    fetch('http://localhost:5000/api/user_info', {
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

export default App;