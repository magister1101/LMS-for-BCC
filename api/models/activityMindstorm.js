const mongoose = require('mongoose');

const activityMindstormSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    course: {type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    mindstormFile: {type: String, required: true},
});

module.exports = mongoose.model('ActivityMindstorm', activityMindstormSchema);