const mongoose = require('mongoose');

const courseProgressSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: {type: String, required: true},
    activity_id: {type: String, required: true},
    progress: {type: Number, required: true},
    createdAt: {type: Date, default: Date.now, required: true},
    isSubmitted: {type: Boolean, default: false},
    
    //archive checker
    isArchived: {type: Boolean, default: false},
});

module.exports = mongoose.model('CourseProgress', courseProgressSchema);