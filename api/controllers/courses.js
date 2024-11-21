const mongoose = require('mongoose');

const Course = require('../models/course'); //schema route

exports.courses_get_all_course = (req, res, next) => { // Course object is reference from course model
    Course.find()
        .exec()
        .then(doc => {
            const response = {
                count: doc.length,
                course: doc
            }
            if (doc.length > 0) {
                return res.status(200).json(response)
            }
            else {
                return res.status(404).json({
                    message: 'No Course Entries Found'
                })
            }

        })
        .catch(err => {
            return res.status(500).json({
                error: err,
            })
        }
        )
};

exports.courses_get_course = (req, res, next) => {
    const id = req.params.id;
    Course.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                return res.status(200).json(doc)
            }
            else {
                return res.status(404).json({
                    message: 'no valid entry for the provided ID'
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        });
};

exports.courses_create_course = (req, res, next) => {

    const course = new Course({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description
    });
    course.save().then(result => {
        return res.status(201).json({
            message: 'Course created',
            course: result,

        })
    })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
};

exports.courses_update_course = (req, res, next) => {
    const { id } = req.params;
    const updateFields = req.body;
    performUpdate(id, updateFields, res);
};

exports.courses_delete_course = (req, res, next) => {
    const id = req.params.id
    Course.deleteOne({
        _id: id
    })
        .exec()
        .then(result => {
            return res.status(200).json({
                message: 'Course Deleted',
                request: {
                    type: 'POST',
                    url: process.env.DOMAIN + process.env.PORT + '/courses',
                    body: { name: 'String', description: 'String' }
                }
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
};

const performUpdate = (id, updateFields, res) => {
    Course.findByIdAndUpdate(id, updateFields, { new: true })
        .then((updated) => {
            if (!updated) {
                return res.status(404).json({ message: "Course Not Found" });
            }
            return res.status(200).json(updated);

        })
        .catch((err) => {
            return res.status(500).json({
                message: "Error in updating Course",
                error: err
            });
        })
};