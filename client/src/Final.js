import React, {Component} from "react";
import "./App.css";
import Jay from "./assets/bluejay.png";
import Done from "./assets/complete.jpg";
import Core from "./assets/core_icon.png";
import BD from "./assets/data_icon.png";
import NLP from "./assets/lang_icon.png";
import R from "./assets/robotics_icon.png";
import IS from "./assets/info_icon.png";
import CB from "./assets/bio_icon.png";
import E from "./assets/elective.png";

import {BrowserRouter as Route,Router,Link,Redirect} from "react-router-dom";


/* Compoent for the final recommended schedule */
class Final extends Component {
    constructor(prop) {
        super(prop);
        // inheritated from FocusArea: this.props.valueFromParent
        //inheritated from SemestersTaken: this.props.valueFromParent2
        this.state = {
            schedule: [""],
            semesters: -2,
            focus_area: '',
            numSchedule: 0
        };
    }

    /* focus area = this.props.valueFromParent
    path # = this.props.valueFromParent2 */
    callAPI() {
        fetch(''.concat('http://localhost:5000/api', this.props.valueFromParent,'/courses',this.props.numSchedule)) 
            .then(res => res.json())
            .then(res => this.setState({
                schedule: res
            }))
            .catch(err => err);
    }


    getParentpProps() {
        this.setState({
            semesters: parseInt(this.props.valueFromParent2),
            numSchedule: parseInt(this.props.numSchedule)
        });
    }

    componentDidMount() {
        this.getParentpProps();
        this.callAPI();
        document.getElementById('li'.concat(this.props.numSchedule)).className = "active1";
        document.getElementById('a'.concat(this.props.numSchedule)).className = "active1_a";
    }
    
    /* If empty schedule returned, redirect to the failing page*/
    renderRedirect = () => {
        if (this.state.schedule.length == 0) {
            return <Redirect to = "/oops"/>;
        }
    }

    render() {
        // some hash tables to help with mapping below
        const year_hash = ['FRESHMAN YEAR', 'SOPHOMORE YEAR', 'JUNIOR YEAR', 'SENIOR YEAR']
        const icon_hash = [Core, BD, NLP, R, IS, CB, E]; // indices correspond to the hash below
        const track_hash = ['core', 'bd', 'nlp', 'r', 'is', 'cb', 'elective'];
        const list0 = [];
        // loop to define list0 semester by semester
        for (var i = 0; i < 4; i++) {
            const cur = this.state.schedule.slice(6 * i, 6 * i + 3);
            const temp1 = cur.map(d => {
                return (
                    <button200
                    class="row"
                    tabindex="0"
                    type="button" disabled>
                        <div class="title">
                        {d.CourseNumber}{": "}{d.CourseTitle}
                        </div>
                        <div class="small_icon_container">
                            <img src={icon_hash[track_hash.indexOf(d.Track)]} class="small_icon"/>
                        </div>
                        <li>{" Credit:"}{d.Credits}</li>
                        <li>{" Instructor:"}{d.Instructor}</li>
                    </button200>
                );
            });
            const cur2 = this.state.schedule.slice(6 * i + 3, 6 * (i + 1));
            const temp2 = cur2.map(d => {
                return (
                    <button200
                    class="row"
                    tabindex="0"
                    type="button" disabled>
                        <div class="title">
                        {d.CourseNumber}{": "}{d.CourseTitle}
                        </div>
                        <div class="small_icon_container">
                            <img src={icon_hash[track_hash.indexOf(d.Track)]} class="small_icon"/>
                        </div>
                        <li>{" Credit:"}{d.Credits}</li>
                        <li>{" Instructor:"}{d.Instructor}</li>
                    </button200>
                );
            });

            // image to indicate that the semester is completed
            const img0 = <div class = 'imgContainer'><img src={Done} style={{width: '100%', height: '100%', float: "left"}} /></div>

            // if both semesters in the column are completed
            if (i * 2 + 1 < this.state.semesters) {
                list0[i] = {details1: img0, details2: img0, 
                semester1: 'Semester '.concat(i * 2 + 1), semester2: 'Semester '.concat(i * 2 + 2),
                year: year_hash[i]};
                console.log(list0[i].details1);
            } else if (i * 2 + 1 == this.state.semesters){ // 1/2 completed
                list0[i] = {details1: img0, details2: temp2, 
                    semester1: 'Semester '.concat(i * 2 + 1), semester2: 'Semester '.concat(i * 2 + 2),
                    year: year_hash[i]};
                    console.log(list0[i].details1);
            } else { // both display course recommendation as neither is completed
                list0[i] = {details1: temp1, details2: temp2, 
                    semester1: 'Semester '.concat(i * 2 + 1), semester2: 'Semester '.concat(i * 2 + 2),
                    year: year_hash[i]};
            }
            
        }

        // maps list0 into html
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
            <div class="wrapper">
                <div class = "center111">
                    <header id="header">
                        <a href="#" class="logo">
                            <img src={Jay} style={{width: 80, height: 80, float: "left"}} />
                            Jaypath <span>{this.state.numSchedule}</span>
                        </a>
                        <ul></ul> 
                        <ul>
                        <li id="li1"><a id="a1" href="/final1">Path 1</a></li>
                        <li id="li2"><a id="a2" href="/final2">Path 2</a></li>
                        <li id="li3"><a id="a3" href="/final3">Path 3</a></li>
        
                        </ul>
                    </header>
                    
                    <div class="message">
                        <div class="small_icon_container2">
                            <img src={Core} class="small_icon"/>: core requirement
                        </div>
                        <div class="small_icon_container2">
                            <img src={BD} class="small_icon"/>: big data
                        </div>
                        <div class="small_icon_container2">
                            <img src={NLP} class="small_icon"/>: natural language processing
                        </div>
                        <div class="small_icon_container2">
                            <img src={R} class="small_icon"/>: robotics
                        </div>
                        <div class="small_icon_container2">
                            <img src={IS} class="small_icon"/>: information security
                        </div>
                        <div class="small_icon_container2">
                            <img src={CB} class="small_icon"/>: computational biology
                        </div>
                    </div>

                    <div class="container2">
                        {list}
                    </div>
                </div>

                <Link to="/">
                    <div class="link_container">
                    <button class="button_r" type="button">
                        <div class="icon_container"><i class="iconfont">&#xe7f9;</i></div>
                        Go Back
                    </button>
                    </div>
                </Link>
            </div>
        );
    }
}

export default Final;
