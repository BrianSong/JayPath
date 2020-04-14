import React, {Component} from "react";
import "./FP.css";
import CoursesTaken from "./App.js";
import {BrowserRouter as Router, Link} from "react-router-dom";

class FailingPage extends Component {
    constructor(prop) {
        super(prop);
        // inheritated from FocusArea: this.props.valueFromParent
        this.state = {
            schedule: [],
        };
    }

    render() {
        return (
            <div style = {{height: 700}}>
            <h1
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    Oops!
                </h1>


            <div class = "title">
                It seems like that you may not be able to graduate based on courses you have taken.</div>

            <div class = "text1"> Are you sure that you have: </div>
            <div class = "note"> > Entered all your completed courses correctly?</div>
            <div class = "note"> > Entered your current grade/year correctly?</div>

            <div class = "text2"> Still unsure?</div>
            
            <div>
                    <Link to="/">
                        <button class="button_b" type="button">
                            DO IT AGAIN!
                        </button>
                    </Link>
                </div>

            </div>
        );
    }
}

export default FailingPage;