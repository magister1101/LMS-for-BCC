const mongoose = require('mongoose');

const activityMindstormSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    course: {type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    mindstormFile: {type: String, required: true},

    //archive checker
    isArchived: {type: Boolean, default: false},
});

module.exports = mongoose.model('ActivityMindstorm', activityMindstormSchema);