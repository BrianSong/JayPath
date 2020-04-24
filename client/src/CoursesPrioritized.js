import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import Autosuggest from 'react-autosuggest';

class CoursesPrioritized extends Component {
    constructor(prop) {
      super(prop);
      this.state = {
        question: "Are there courses that particularly interest you?",
        note: "(We will include as many of them in your path as possible.)",
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
      fetch('http://localhost:5000/api/courses_prioritized', {
        // mode: 'no-cors',
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
          <div class="center_new">
            <h1 class = "question">
              {this.state.question}
            </h1>
            <text1 class = "question">
                {this.state.note}
            </text1>
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

  export default CoursesPrioritized;