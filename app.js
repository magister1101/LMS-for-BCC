const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParaser = require('body-parser');
const mongoose = require('mongoose');

const courseRoutes = require('./api/routes/courses');
const activityRoutes = require('./api/routes/activities');

mongoose.connect('mongodb+srv://markjules13:' + process.env.MONGO_ATLAS_PW + '@node-rest-bcc.t39id.mongodb.net/?retryWrites=true&w=majority&appName=node-rest-bcc');
console.log(process.env.PORT)

app.use(morgan('dev'));
app.use(bodyParaser.urlencoded({extended: false}));
app.use(bodyParaser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


// routes
app.use('/courses', courseRoutes); 
app.use('/activities', activityRoutes); 

app.use((req, res, next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})

module.exports = app;