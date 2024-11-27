const mongoose = require('mongoose');
const { upload } = require('../../configs/uploadConfigActivity');

const Course = require('../models/course'); //schema route
const User = require('../models/user'); //schema route
const Log = require('../models/log'); //schema route


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

const performLog = async (userId, action, reference, key, res) => {
    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        var newReference = null;

        if (key === 'user') {
            const _user = await User.findOne({ _id: reference });
            newReference = _user.firstName + ' ' + _user.lastName + ' (USER)';
        }
        else if (key === 'course') {
            const _course = await Course.findOne({ _id: reference });
            newReference = _course.name + ' (COURSE)';
        }
        else if (key === 'activity') {
            const _activity = await Course.activities.findOne({ _id: reference });
            newReference = _activity.name + ' (ACTIVITY)';
        } else {
            return res.status(400).json({ message: 'Invalid key' });
        }

        const name = user.firstName + ' ' + user.lastName;

        const log = new Log({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            action: action,
            reference: newReference,
        });

        await log.save();
        return console.log({ message: 'Log saved successfully', log });

    } catch (err) {
        console.error('Error performing log:', err);
        if (res) {
            return console.error({
                message: 'Error in performing log',
                error: err.message
            });
        }
    }
};

exports.coursesGetCourse = async (req, res, next) => {
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

exports.getActivityById = async (req, res) => {
    try {
        const { courseId, activityId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(activityId)) {
            return res.status(400).json({ message: 'Invalid courseId or activityId.' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

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

exports.submitActivity = async (req, res) => {

    const courseId = req.params.id;
    const { activityId, studentId } = req.body;
    var userInfo;
    await User.findOne({ _id: studentId })
        .exec()
        .then(user => {
            return userInfo = user;
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            });
        });
    try {
        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Find the activity within the course
        const activity = course.activities.id(activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Handle file upload
        const file = req.file?.path;
        if (!file) {
            return res.status(400).json({ message: 'Submission file is required' });
        }

        // Create a new submission object
        const newSubmission = {
            _id: new mongoose.Types.ObjectId(),
            studentId: userInfo.firstName + " " + userInfo.lastName,
            submissionFile: file,
            isCompleted: false,
            isArchived: false
        };

        // Add the submission to the activity's submissions array
        activity.submissions.push(newSubmission);

        // Save the updated course
        await course.save();

        return res.status(200).json({
            message: 'Activity submitted successfully',
            submission: newSubmission,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

exports.coursesCreateCourse = (req, res, next) => {

    const course = new Course({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        file: req.file?.path,
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

exports.coursesUpdateCourse = (req, res, next) => {
    const { id } = req.params;
    const updateFields = req.body;
    performUpdate(id, updateFields, res);
};

exports.coursesAddActivity = async (req, res, next) => {
    const userId = req.userData.userId;
    const courseId = req.params.id;

    const { name, description } = req.body;
    let newActivity = {};

    if (!name || !description) {
        return res.status(400).json({ message: 'Name and description are required' });
    }

    try {
        if (req.file) {
            const file = req.file.path;
            newActivity = {
                _id: new mongoose.Types.ObjectId(),
                name,
                description,
                activityFile: file,
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

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $push: { activities: newActivity } },
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        performLog(userId, 'created', courseId, 'activity', res)
        return res.status(200).json({
            message: 'Activity added successfully',
            updatedCourse,
        });
    } catch (error) {

        return res.status(500).json({ message: error.message });
    }
};

exports.coursesUpdateActivity = (req, res, next) => {
    const { courseId, activityId } = req.params;
    const updateFields = req.body;
    const userId = req.userData.userId;
    performLog(userId, 'updated', activityId, 'activity', res)
    performActivityUpdate(courseId, activityId, updateFields, res);
    return res.status(200).json({ message: 'Activity updated successfully' })
};




