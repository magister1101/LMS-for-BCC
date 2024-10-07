const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    // middleName: {type: String},
    // gender: {female: String, required: true},
    // contactNumber: {type: String, required: true},
    
});

module.exports = mongoose.model('User', userSchema);