import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            apiResponse: "",
            number: ""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    callAPI() {
        fetch('http://localhost:5000/api/test')
            .then(res => res.text())
            .then(res => this.setState({apiResponse: res}))
            .catch(err => err)
    }

    componentDidMount() {
        this.callAPI();
    }

    handleChange(event) {
        this.setState({number: event.target.value});
    }

    handleSubmit(event){
        fetch("http://localhost:5000/api/courses/" + this.state.number)
            .then(res => res.json())
            .then(data => this.setState({apiResponse: data.name}))
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
                    <input type="text" onChange={this.handleChange}/>
                </label>
                <p>{this.state.apiResponse}</p>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

export default App;
