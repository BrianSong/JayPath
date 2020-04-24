import React, {Component} from "react";
import "./App.css";
import Jay from "./bluejay.png";
import Done from "./complete.jpg";
import {BrowserRouter as Route,Router,Link,Redirect} from "react-router-dom";

class Final extends Component {
    constructor(prop) {
        super(prop);
        // inheritated from FocusArea: this.props.valueFromParent
        //inheritated from SemestersTaken: this.props.valueFromParent2
        this.state = {
            schedule: [""],
            semesters: -2,
            focus_area: '',
        };
    }

    callAPI() {
        fetch(''.concat('http://localhost:5000/api', this.state.focus_area,'/courses'))
            .then(res => res.json())
            .then(res => this.setState({
                schedule: res
            }))
            .catch(err => err);
    }

    getParentpProps() {
        this.setState({
            semesters: this.props.valueFromParent2,
            focus_area: parseInt(this.props.valueFromParent)
        });
    }

    componentDidMount() {
        this.callAPI();
        this.getParentpProps();
    }
    
    renderRedirect = () => {
        if (this.state.schedule.length == 0) {
            return <Redirect to = "/oops"/>;
        }
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

            const img0 = <div class = 'imgContainer'><img src={Done} style={{width: '100%', height: '100%', float: "left"}} /></div>

            if (i * 2 + 1 < this.state.semesters) {
                list0[i] = {details1: img0, details2: img0, 
                semester1: 'Semester '.concat(i * 2 + 1), semester2: 'Semester '.concat(i * 2 + 2),
                year: year_hash[i]};
                console.log(list0[i].details1);
            } else if (i * 2 + 1 == this.state.semesters){
                list0[i] = {details1: img0, details2: temp2, 
                    semester1: 'Semester '.concat(i * 2 + 1), semester2: 'Semester '.concat(i * 2 + 2),
                    year: year_hash[i]};
                    console.log(list0[i].details1);
            } else {
                list0[i] = {details1: temp1, details2: temp2, 
                    semester1: 'Semester '.concat(i * 2 + 1), semester2: 'Semester '.concat(i * 2 + 2),
                    year: year_hash[i]};
            }
            
        }
        const list = list0.map(l => {
            return (

                <div class="schoolyear_Box">
                    {this.renderRedirect()}
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
            <div class = "center111">
                <h1 class = "my_path">
                    <img src={Jay} style={{width: 50, height: 50, float: "left"}} />
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