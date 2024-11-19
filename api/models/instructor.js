const mongoose = require('mongoose');
const { type } = require('os');

const instructorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String },
    gender: { type: String, required: true },
    isInstructor: { type: Boolean, default: true },

    //image
    qrCode: { type: String },
    userImage: { type: String, required: true },

    //archive checker
    isArchived: { type: Boolean, default: false },
});

module.exports = mongoose.model('Instructor', instructorSchema);