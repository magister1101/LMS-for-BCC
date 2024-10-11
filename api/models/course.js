const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    description: {type: String, required: true},
    
    //archive checker
    isArchived: {type: Boolean, default: false},
});

module.exports = mongoose.model('Course', courseSchema);