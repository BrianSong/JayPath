import React, {Component} from "react";
import "./App.css";
import Jay from "./bluejay.png";
import {BrowserRouter as Link} from "react-router-dom";

class Final extends Component {
    constructor(prop) {
        super(prop);
        // inheritated from FocusArea: this.props.valueFromParent
        this.state = {
            schedule: [],
        };
    }

    callAPI() {
        fetch(''.concat('http://localhost:5000/api', this.props.valueFromParent,'/courses'))
            .then(res => res.json())
            .then(res => this.setState({
                schedule: res
            }))
            .catch(err => err);
    }

    componentDidMount() {
        this.callAPI();
    }

    render() {
        const year_hash = ['FRESHMAN YEAR', 'SOPHOMORE YEAR', 'JUNIOR YEAR', 'SENIOR YEAR']
        const list0 = [];
        for (var i = 0; i < 4; i++) {
            const cur = this.state.schedule.slice(6 * i, 6 * i + 3);
            const temp1 = cur.map(d => {
                return (
                    <button200
                    class="row"
                    tabindex="0"
                    type="button" disabled><li>
                        {d.CourseNumber}
                        {": "}
                        {d.CourseTitle}
                        {" Credit:"}
                        {d.Credits}
                        {" Instructor:"}
                        {d.Instructor}
                    </li></button200>
                );
            });
            const cur2 = this.state.schedule.slice(6 * i + 3, 6 * (i + 1));
            const temp2 = cur2.map(d => {
                return (
                    <button200
                    class="row"
                    tabindex="0"
                    type="button" disabled><li>
                        {d.CourseNumber}
                        {": "}
                        {d.CourseTitle}
                        {" Credit:"}
                        {d.Credits}
                        {" Instructor:"}
                        {d.Instructor}
                    </li></button200>
                );
            });

            list0[i] = {details1: temp1, details2: temp2, 
                semester1: 'Semester'.concat(i * 2 + 1), semester2: 'Semester'.concat(i * 2 + 2),
                year: year_hash[i]};
        }
        const list = list0.map(l => {
            return (
                <div class="schoolyear_Box">
                    <div class="hh1">{l.year}</div>
                    <div class="text1">
                        <div class="hh2">{l.semester1}</div>
                    </div>
                    <div class="box1">{l.details1}</div>
                    <div class="text1">
                        <div class="hh3">{l.semester2}</div>
                    </div>
                    <div class="box2">{l.details2}</div>
                </div>
            );
        });

    
        
        return (
            <div>
                <h1
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <img src={Jay} style={{width: 50, height: 50, float: "left"}}></img>
                    MY PATH
                </h1>
                <div class="container2">
                    {list}
                </div>

                <div>
                    <Link to="/">
                        <button class="button_r" type="button">
                            Go Back
                        </button>
                        <i class="iconfont" style={{position: "absolute", right: "40px"}}>&#xe7f9;</i>
                    </Link>
                </div>

            </div>
        );
    }
}

export default Final;