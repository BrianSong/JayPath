import React, {Component} from 'react';
import logo from './logo.svg';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: "What is your focus area in computer science?",
            apiResponse: "",
            number: "",
            data: []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
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

    handleSubmit(event) {
        fetch("http://localhost:5000/api/courses/" + this.state.number)
            .then(res => res.json())
            .then(data => this.setState({apiResponse: data.name}))
        event.preventDefault();
    }

    handleClick(event) {

    }


    render() {
        return (
            <Router>

                <Switch>
                    <Route exact path="/">
                        <div>
                            <h1 style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                {this.state.question}
                            </h1>
                            <div style={{
                                marginLeft: "auto",
                                display: "flex",
                                justifyContent: "center",
                            }}>
                                <Link to="/r">
                                    <button class="button1" type="button">Robotics</button>
                                </Link>
                                <Link to="/bd">
                                    <button class="button4" type="button">Big Data</button>
                                </Link>
                                <Link to="/is">
                                    <button class="button5" type="button">Information Security</button>
                                </Link>
                                <Link to="/cb">
                                    <button class="button3" type="button">Computational Biology</button>
                                </Link>
                                <Link to="/nlp">
                                    <button class="button2" type="button">Natural Language Processing</button>
                                </Link>
                            </div>
                        </div>
                    </Route>
                    <Route path="/nlp">
                        <NLP/>
                    </Route>
                    <Route path="/r">
                        <ROB/>
                    </Route>
                    <Route path="/bd">
                        <BD/>
                    </Route>
                    <Route path="/is">
                        <IS/>
                    </Route>
                    <Route path="/cb">
                        <CB/>
                    </Route>
                </Switch>
            </Router>
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
        fetch('http://localhost:5000/api/nlp/courses')
            .then(res => res.json())
            .then(res => this.setState({schedule: res})
            ).catch(err => err);
    }


    componentDidMount() {
        this.callAPI();
    }


    render() {
        const listItems = this.state.schedule.map((d) => <li key={d.CourseTitle}>{d.CourseTitle}</li>);
        return (
            <div>
                <h1 style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    Welcome to Natural Language Processing!
                </h1>
                <div>
                    {listItems}
                </div>
            </div>
        );
    }

}

class CB extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            apiResponse: "",
            schedule: []
        };
    }

    callAPI() {
        fetch('http://localhost:5000/api/cb/courses')
            .then(res => res.json())
            .then(res => this.setState({schedule: res}))
            .catch(err => err)
    }

    componentDidMount() {
        this.callAPI();
    }


    render() {
        const listItems = this.state.schedule.map((d) => <li key={d.CourseTitle}>{d.CourseTitle}</li>);
        return (
            <div>
                <h1 style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
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
        fetch('http://localhost:5000/api/is/courses')
            .then(res => res.json())
            .then(res => this.setState({schedule:res}))
            .catch(err => err)
    }

    componentDidMount() {
        this.callAPI();
    }


    render() {
        const listItems = this.state.schedule.map((d) => <li key={d.CourseTitle}>{d.CourseTitle}</li>);
        return (
            <div>
                <h1 style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
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
            schedule:[]
        };
    }

    callAPI() {
        fetch('http://localhost:5000/api/r/courses')
            .then(res => res.json())
            .then(res => this.setState({schedule: res}))
            .catch(err => err)
    }

    componentDidMount() {
        this.callAPI();
    }


    render() {
        const listItems = this.state.schedule.map((d) => <li key={d.CourseTitle}>{d.CourseTitle}</li>);
        return (
            <div>
                <h1 style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
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
            schedule:[]
        };
    }

    callAPI() {
        fetch('http://localhost:5000/api/bd/courses')
            .then(res => res.json())
            .then(res => this.setState({schedule: res}))
            .catch(err => err)
    }

    componentDidMount() {
        this.callAPI();
    }


    render() {
        const listItems = this.state.schedule.map((d) => <li key={d.CourseTitle}>{d.CourseTitle}</li>);
        return (
            <div>
                <h1 style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    Welcome to Big Data!
                </h1>
                <div>{listItems}</div>
            </div>

        );
    }

}

export default App;
