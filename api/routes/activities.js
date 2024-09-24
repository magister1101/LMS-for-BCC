const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Activity = require('../models/activity'); //schema
const Course = require('../models/course');
const { describe } = require('node:test');

router.get('/', (req, res, next) => {
    Activity.find()
        .select('course name description _id')
        .exec()
        .then(doc => {
            res.status(200).json({
                count: doc.length,
                activity: doc.map(doc => {
                    return {
                        _id: doc._id,
                        course: doc.course,
                        name: doc.name,
                        description: doc.description,
                        request: {
                            type: 'GET',
                            url: 'http:localhost:' + process.env.PORT + '/activities/' + doc._id
                        }
                    }
                })

            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
})

router.post('/', (req, res, next) => {
    Course.findById(req.body.courseId)
        .then(course => {
            if(!course){
                return res.status(404).json({
                    message: "course not found"
                })
            }
            const activity = new Activity({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                description: req.body.description,
                course: req.body.courseId
            });

            return activity.save()
        })
        .then(result => {
            console.log(result),
                res.status(201).json({
                    message: 'Activity created',
                    createdActivity: {
                        _id: result._id,
                        course: result.course,
                        name: result.name,
                        description: result.description
                    },
                    request: {
                        type: 'GET',
                        url: 'http:localhost:' + process.env.PORT + '/activities/' + result._id
                    }
                })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Course not found',
                error: err
            })
        })

})

router.get('/:activityId', (req, res, next) => {
    Activity.findById(req.params.activityId)
    .exec()
    .then(activity =>{
        if(!activity){
            return res.status(404).json({
                message: 'Activity not found'
            })
        }
        res.status(200).json({
            activity: activity,
            request: {
                type: 'GET',
                description: 'Get all activities',
                url: 'http:localhost:' + process.env.PORT + '/activities/'
            }
        });
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        })
    })
})

router.delete('/:activityId', (req, res, next) => {
    const id = req.params.activityId
    Activity.deleteOne({
        _id: id
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Activity Deleted",
                request: {
                    type: 'POST',
                    url: 'http://localhost:' + process.env.PORT + '/activities',
                    body: { courseId: 'ID', name: 'String', description: 'String' }
                }
            })
        })
        .catch(err => {
            console.log(err),
                res.status(500).json({
                    error: err
                })
        })
})


module.exports = router;