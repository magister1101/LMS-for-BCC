const mongoose = require('mongoose');

const Course = require('../models/course'); //schema route

exports.courses_get_all_course = (req, res, next) => { // Course object is reference from course model
    Course.find()
        .select('name description _id') //select the response you want to pass to the client
        .exec()
        .then(doc => {
            const response = {
                count: doc.length,
                course: doc.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        description: doc.description,
                        request: {
                            type: 'GET',
                            url: process.env.DOMAIN + process.env.PORT + '/courses/' + doc._id
                        }
                    }
                })
            }
            if (doc.length > 0) {
                res.status(200).json(response)
            }
            else {
                res.status(404).json({
                    message: 'No Course Entries Found'
                })
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            })
        }
        )
};

exports.courses_create_course = (req, res, next) => {

    const course = new Course({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description
    });
    course.save().then(result => {
        console.log(result)
        res.status(201).json({
            message: 'Course created',
            createdCourse: {
                id: result._id,
                name: result.name,
                description: result.description,
                request: {
                    type: 'GET',
                    url: process.env.DOMAIN + process.env.PORT + '/courses/' + result._id
                }
            }
        })
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
};

exports.courses_get_course = (req, res, next) => {
    const id = req.params.courseId;
    Course.findById(id)
        .select('name description _id')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    course: doc,
                    request: {
                        type: 'GET',
                        description: 'get all courses',
                        url: process.env.DOMAIN + process.env.PORT + '/courses'
                    }
                }) //doc is the info here
            }
            else {
                res.status(404).json({
                    message: 'no valid entry for the provided ID'
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
};

exports.courses_update_course = (req, res, next) => {
    const id = req.params.courseId;
    const updateOps = {}; //update operations
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value; //propName is the property to get the property name of the object that will be patched from JSON 
    }
    Course.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
};

exports.courses_delete_course = (req, res, next) => {
    const id = req.params.courseId
    Course.deleteOne({
        _id: id
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Course Deleted',
                request: {
                    type: 'POST',
                    url: process.env.DOMAIN + process.env.PORT + '/courses',
                    body: { name: 'String', description: 'String' }
                }
            })
        })
        .catch(err => {
            console.log(err),
                res.status(500).json({
                    error: err
                })
        })
};