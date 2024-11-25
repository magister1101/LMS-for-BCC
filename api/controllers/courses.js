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

exports.courses_get_course = async (req, res, next) => {
    try {
        const { isArchived, query } = req.query;
        const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        let searchCriteria = {};
        const queryConditions = [];

        if (query) {
            const escapedQuery = escapeRegex(query);
            const orConditions = [];

            if (mongoose.Types.ObjectId.isValid(query)) {
                orConditions.push({ _id: query });
            }

            orConditions.push(
                { name: { $regex: escapedQuery, $options: 'i' } },
                { description: { $regex: escapedQuery, $options: 'i' } },
            );

            queryConditions.push({ $or: orConditions });

            if (isArchived) {
                const archiveStatus = isArchived === 'true';
                queryConditions.push({ isArchived: archiveStatus });
            }

            if (queryConditions.length > 0) {
                searchCriteria = { $and: queryConditions };
            }
        }
        const course = await Course.find(searchCriteria);
        return res.status(200).json(course);


    } catch (err) {
        return res.status(500).json(err);
    }
};

exports.courses_create_course = (req, res, next) => {

    const course = new Course({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        courseFile: req.body.courseFile,
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

exports.courses_add_activity = async (req, res, next) => {
    const courseId = req.params.id;

    // Validate file upload
    const { name, description } = req.body;
    let newActivity = {};

    // Validate input fields
    if (!name || !description) {
        return res.status(400).json({ message: 'Name and description are required' });
    }

    try {
        if (req.file) {
            const activityFile = req.file.path;
            newActivity = {
                _id: new mongoose.Types.ObjectId(),
                name,
                description,
                activityFile,
                isArchived: false,
            };
        }
        else {
            newActivity = {
                _id: new mongoose.Types.ObjectId(),
                name,
                description,
                isArchived: false,
            };
        }

        // Find course and add the activity
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $push: { activities: newActivity } },
            { new: true, runValidators: true } // Return the updated course and validate input
        );

        // Check if the course was found
        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Respond with success and updated course
        return res.status(200).json({
            message: 'Activity added successfully',
            updatedCourse,
        });
    } catch (error) {
        // Handle server errors
        return res.status(500).json({ message: error.message });
    }
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

exports.courses_update_activity = (req, res, next) => {
    const { courseId, activityId } = req.params;
    const updateFields = req.body;

    performActivityUpdate(courseId, activityId, updateFields, res);
};

const performActivityUpdate = (courseId, activityId, updateFields, res) => {
    Course.findOneAndUpdate(
        { _id: courseId, "activities._id": activityId }, // Match course and activity
        { $set: { "activities.$": { ...updateFields, _id: activityId } } }, // Update activity fields
        { new: true, runValidators: true } // Return updated document, validate fields
    )
        .then((updatedCourse) => {
            if (!updatedCourse) {
                return res.status(404).json({ message: "Course or Activity Not Found" });
            }
            return res.status(200).json({
                message: "Activity updated successfully",
                updatedCourse,
            });
        })
        .catch((err) => {
            return res.status(500).json({
                message: "Error in updating Activity",
                error: err,
            });
        });
};

exports.get_activity_by_id = async (req, res) => {
    try {
        const { courseId, activityId } = req.params;

        // Validate courseId and activityId
        if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(activityId)) {
            return res.status(400).json({ message: 'Invalid courseId or activityId.' });
        }

        // Find the course and filter for the specific activity
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        // Find the specific activity
        const activity = course.activities.find(
            (activity) => activity._id.toString() === activityId
        );

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found.' });
        }

        // Return the activity
        return res.status(200).json(activity);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving activity.',
            error: error.message,
        });
    }
};