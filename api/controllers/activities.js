const mongoose = require('mongoose');

const Activity = require('../models/activity');
const Course = require('../models/course');

exports.activities_get_all_activity = (req, res, next) => {
    Activity.find()
        .select('course name description _id activityImage isArchived') //select only the fields to be displayed
        .populate('course', 'name description') //get course as response, this reference the course in the activity model
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
                            isArchived: doc.isArchived,
                            request: {
                                type: 'GET',
                                url: process.env.DOMAIN + process.env.PORT + '/activities/' + doc._id
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
};

exports.activities_create_activity = (req, res, next) => { //activityImage is the name of the input field in the form
    // console.log("Incoming file:", req.file);
    // console.log("Incoming body:", req.body);

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
                activityFile: req.file.path
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
                        url: process.env.DOMAIN + process.env.PORT + '/activities/' + result._id
                    }
                })
        })
        .catch(err => {
            // Check if the error is already handled or if the response was already sent
            if (!res.headersSent) {
                res.status(500).json({
                    message: 'An error occurred',
                    error: err
                });
            }
        });

};

exports.activities_get_activity = (req, res, next) => {
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
                    url: process.env.DOMAIN + process.env.PORT + '/activities/'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};

exports.activities_update_activity = (req, res, next) => {
    const id = req.params.activityId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value; //propName is the property to get the property name of the object that will be patched from JSON 
    }
    Activity.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
};

exports.activities_archive_activity = async (req, res, next) => {
    const id = req.params.activityId;
    const { isArchived } = req.body;

    if (typeof isArchived !== 'boolean') {
        return res.status(400).json({
            message: "isArchived must be a boolean"
        });
    }

    try {
        const updatedActivity = await Activity.findByIdAndUpdate(id, { isArchived }, { new: true });
        if (!updatedActivity) {
            return res.status(404).json({
                message: "Activity not found"
            });
        }
        res.status(200).json({
            message: "Activity updated",
            updatedActivity: {
                _id: updatedActivity._id,
                course: updatedActivity.course,
                name: updatedActivity.name,
                description: updatedActivity.description,
                isArchived: updatedActivity.isArchived
            },
            request: {
                type: 'GET',
                url: process.env.DOMAIN + process.env.PORT + '/activities/' + updatedActivity._id
            }
        });
    }
    catch (err) {
        res.status(500).json({
            error: err
        })
    }
};

exports.activities_delete_activity = (req, res, next) => {
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
                    url: process.env.DOMAIN + process.env.PORT + '/activities',
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
};

exports.activities_delete_all_activity = (req, res, next) => {
    Activity.deleteMany({})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "All activities deleted",
                request: {
                    type: 'POST',
                    url: process.env.DOMAIN + process.env.PORT + '/activities',
                    body: { courseId: 'ID', name: 'String', description: 'String' }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};