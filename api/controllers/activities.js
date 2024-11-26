const mongoose = require('mongoose');

const Activity = require('../models/activity');
const Course = require('../models/course');

const performUpdate = (id, updateFields, res) => {
    Activity.findByIdAndUpdate(id, updateFields, { new: true })
        .populate('course')
        .then((updated) => {
            if (!updated) {
                return res.status(404).json({ message: "Activity Not Found" });
            }
            return res.status(200).json(updated);

        })
        .catch((err) => {
            return res.status(500).json({
                message: "Error in updating Activity",
                error: err
            });
        })
};

exports.activities_get_all_activity = (req, res, next) => {
    Activity.find()
        .populate('course')
        .exec()
        .then(doc => {
            res.status(200).json(
                {
                    count: doc.length,
                    activity: doc

                }
            );
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            });
        });
};

exports.activities_get_activity = (req, res, next) => {
    Activity.findById(req.params.activityId)
        .populate('course')
        .exec()
        .then(activity => {
            if (!activity) {
                return res.status(404).json({
                    message: 'Activity not found'
                })
            }
            res.status(200).json({ activity });
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
};

exports.activities_create_activity = (req, res, next) => {
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

            activity.save()
        })
        .then(result => {
            return res.status(201).json({
                message: 'Activity created',
            })
        })
        .catch(err => {
            // Check if the error is already handled or if the response was already sent
            if (!res.headersSent) {
                return res.status(500).json({
                    message: 'An error occurred',
                    error: err
                });
            }
        });

};

exports.activities_update_activity = (req, res, next) => {
    const { id } = req.params;
    const updateFields = req.body;
    performUpdate(id, updateFields, res);
};

exports.activities_delete_activity = (req, res, next) => {
    const id = req.params.activityId
    Activity.deleteOne({
        _id: id
    })
        .exec()
        .then(result => {
            return res.status(200).json({
                message: "Activity Deleted",
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
};

exports.activities_delete_all_activity = (req, res, next) => {
    Activity.deleteMany({})
        .exec()
        .then(result => {
            return res.status(200).json({
                message: "All activities deleted",
            });
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            });
        });
};

