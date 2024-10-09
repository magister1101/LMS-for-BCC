const mongoose = require('mongoose');

const attendance = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: {type: String, required: true},
    attendanceDate: {type:Date, default: Date.now, required: true},
});

module.exports = mongoose.model('Attendance', attendance);