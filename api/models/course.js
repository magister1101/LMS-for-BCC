const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String, required: true },
    activities: [{
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String },
        description: { type: String },
        file: { type: String },
        isArchived: { type: Boolean },

        submissions: [{
            _id: mongoose.Schema.Types.ObjectId,
            studentId: { type: String },
            studentName: { type: String },
            file: { type: String },
            status: { type: String, default: 'pending' }, //pending, approved, rejected
            isCompleted: { type: Boolean },
            isArchived: { type: Boolean },
        }],
    }],
    file: { type: String },
    isArchived: { type: Boolean, default: false },
});

module.exports = mongoose.model('Course', courseSchema);