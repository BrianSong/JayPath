const Joi = require('joi');
const express = require('express');
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const courses = [
    {id : 1, name:'course1'},
    {id : 2, name:'course2'},
    {id : 3, name:'course3'},
];

app.get('/', (req, res) => {
    res.send('Hello World!!');
});

app.get('/api/courses', (req, res) => {
   res.send(courses);
});

app.get('/api/test', (req, res) => {
   res.send('Test API is Working!');
});

app.post('/api/courses', (req, res)=>{
    const { error } = validateCourse(req.body); //object destructuring
    if (error){
        // 400 Bad Request
        res.status(400).send(error.details[0].message);
        return;
    }
   const course = {
       id: courses.length + 1,
       name: req.body.name
   };
   courses.push(course);
   res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    //Lookup Course
    const course = courses.find(c => c.id == parseInt(req.params.id));
    if (!course){
        res.status(404).send('Course not found');
    }

    //const result = validateCourse(req.body);
    const result = validateCourse(req.body); //object destructuring
    if (result.error){
        // 400 Bad Request
        res.status(400).send(result.error.details[0].message);
        return;
    }

    course.name = req.body.name;
    res.send(course);
});

// /api/courses/1

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id == parseInt(req.params.id));
    if (!course){
        res.status(404).send('Course not found');
    } //404
    res.send(course);
});

function validateCourse(course){
    const schema = {
      name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}


// PORT
const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Listening on port ' + port));
