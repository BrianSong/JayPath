# Requirement Specification Document

## Problem Statement 

> Write a few sentences that describes the problem you are trying to solve. In other words, justify why this software project is needed.

Choosing what courses to take for a coming semester and not knowing how to plan ahead for successful graduation can be stressful. The problem is further complicated by all kinds of restrictions on course scheduling, including considering different prerequisites and spring/fall offerings. Students need a personalized course planning system recommending which courses to take each semester that is tailored to his/her academic interests.


## Potential Clients
> Who are affected by this problem (and would benefit from the proposed solution)? I.e. the potential users of the software you are going to build.

Undergraduate students at Johns Hopkins University who are taking courses and planning to graduate at a desirable time.

## Proposed Solution
> Write a few sentences that describes how a software solution will solve the problem described above.

A web-based application will be used to solve this problem. Our application takes inputs from users (e.g., major, year of study, courses they have taken, interested areas of focus, expected graduation year) and connects with the university’s degree audit system as well as the course registration system to fetch program requirements and course information, and then it will use our built-in intelligence algorithm to recommend an optimal course schedules for each upcoming semester through a calendar view. 

## Functional Requirements
> List the (functional) requirements that software needs to have in order to solve the problem stated above. It is useful to write the requirements in form of **User Stories** and group them into those that are essential (must have), and those which are non-essential (but nice to have).


### Must have

As a student, I want to input my major, the courses I have taken, and the number of semesters I have left so that I can view a schedule tailored to my needs.  
As a student, I want to input my major and courses taken so that the application knows my current progress.
As a student, I want to see a list of courses that I'm eligible for in the next semester so that I can choose between them.
As a student, I want to choose an area I would like to focus on so that I can take courses I am more interested in.  
As a student, I want to view the suggested course sequence so that I know what to take each semester.  
As a student, I want to determine the number of courses I want to take each semester so that I can evenly distribute remaining courses to each semester.  
As an admin, I want to add/delete courses based on school offerings so that students can obtain correct schedules.  
As an admin, I want to specify course relationships (whether one is prerequisite of another) so that students can take courses in sequence.  
As an admin, I want to monitor major graduation requirements, so that the software can modify schedules accordingly.  
As a student, I want to receive a schedule that fits into the school’s spring/fall course offerings, so that the schedule is correct and practical.  
As a student, I want to receive a schedule that doesn’t contain time conflicts, so that I can directly use it as my plan.  
As a student, I want to get my course recommendations displayed by calendar view to get better/more convenient user experience.  
As a student, I want to be able to choose between several potential paths, so that I can pick the one that interests me the most.  
As a student, I want to see my progress in meeting the degree requirements, so that I know my current position in the entire plan.  
As a student, I want to see the degree requirements themselves in this application, so that I can be confident with the plans.  
As a student, I want to log in/out into this application, so that I can save my information.  

### Nice to have

As a student, I can specify my areas of focus/preference in my major, so that the relevant courses will be prioritized.  
As a student, I want to open a mode called "multiple major mode" so that I can get my recommendation if I decide to take the multiple major option.  
As a student, I want to have an evaluation function so that I can predict the average GPA for each recommendation path.  
As a student who wants to graduate early, I want to set my expected graduation year and get optimal schedule recommendations so that I can fulfill the graduate requirements with the least time and credits.  
As a student, when getting course recommendations, I want to be able to rearrange/modify the recommended schedule in the application so that I can customize it based on my own preferences.  
As a student, I want to be able to import and extract course schedules as files so that I can easily share my schedule with my friends.  

## Software Architecture
> Will this be a Web/desktop/mobile (all, or some other kind of) application? Would it conform to the Client-Server software architecture? 

This will be a web application, and it  would conform to the Client-Server software architecture. The client (student) sends his/her background information (majors/minors, courses taken, focus areas) through the web interface (front end) to the server and the server sends responses (recommended course plan) to the client (student) based on information stored in the database (graduation requirement, course prerequisites, course availability and course history). 