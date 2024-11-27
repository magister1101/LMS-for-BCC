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
        isArchived: { type: Boolean },

        submissions: [{
            _id: mongoose.Schema.Types.ObjectId,
            studentId: { type: String },
            submissionFile: { type: String },
            isCompleted: { type: Boolean },
            isArchived: { type: Boolean },
        }],
    }],
    courseFile: { type: String },
    isArchived: { type: Boolean, default: false },
});

module.exports = mongoose.model('Course', courseSchema);