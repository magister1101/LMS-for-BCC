const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String, required: true },
    activities: [{
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String },
        description: { type: String },
        activityFile: { type: String },
        isArchived: { type: Boolean }
    }],
    courseFile: { type: String },
    isArchived: { type: Boolean, default: false },

    submissions: [{
        _id: mongoose.Schema.Types.ObjectId,
        student: { type: String },
        submissionFile: { type: String },
    }]
});

module.exports = mongoose.model('Course', courseSchema);