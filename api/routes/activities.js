const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') //cb - callback function to store the file
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + new Date().toISOString() + file.originalname); //cb - callback function to rename the file
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") { //check if the file is an image
        cb(null, true)

    } else {
        cb(null, false)
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 20
    },
    fileFilter: fileFilter
});


const Activity = require('../models/activity'); //schema
const Course = require('../models/course');
const { describe } = require('node:test');

router.get('/', (req, res, next) => {
    Activity.find()
        .select('course name description _id activityImage') //select only the fields to be displayed
        .populate('course', 'name') //get course as response, this reference the course in the activity model
        .exec()
        .then(doc => {
            res.status(200).json(
                {
                    count: doc.length,
                    activity: doc.map(doc => {
                        return {
                            _id: doc._id,
                            course: doc.course,
                            name: doc.name,
                            description: doc.description,
                            activityImage: doc.activityImage,
                            request: {
                                type: 'GET',
                                url: 'http:localhost:' + process.env.PORT + '/activities/' + doc._id
                            }
                        }
                    })

                }
            );
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
})

router.post('/', upload.single('activityImage'), (req, res, next) => {
    console.log("Incoming file:", req.file);
    console.log("Incoming body:", req.body);

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    Course.findById(req.body.courseId)
        .then(course => {
            if (!course) {
                return res.status(404).json({
                    message: "course not found"
                })
            }
            const activity = new Activity({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                description: req.body.description,
                course: req.body.courseId,
                activityImage: req.file.path
            });

            return activity.save()
        })
        .then(result => {
            console.log('result: ' + result),
                res.status(201).json({
                    message: 'Activity created',
                    createdActivity: {
                        _id: result._id,
                        course: result.course,
                        name: result.name,
                        description: result.description,
                        activityImage: result.activityImage
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
        .select('course name description _id activityImage')
        .populate('course')
        .exec()
        .then(activity => {
            if (!activity) {
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
        .catch(err => {
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