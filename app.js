const express = require('express');
const serverless = require('serverless-http');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const dotenv = require('dotenv').config();


const courseRoutes = require('./api/routes/courses');
const userRoutes = require('./api/routes/users');
const configRouutes = require('./api/routes/configs');




mongoose.connect('mongodb+srv://markjules13:markjules123@node-rest-bcc.t39id.mongodb.net/?retryWrites=true&w=majority&appName=node-rest-bcc');
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads')); // make the uploads folder accessible
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.use(cors());
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
app.use('/users', userRoutes);
app.use('/configs', configRouutes);



app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})

module.exports = app;
module.exports.handler = serverless(app);