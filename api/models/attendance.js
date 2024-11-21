const mongoose = require('mongoose');
const Date = new Date();

const attendanceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: { type: String, required: true },
    attendanceDateStartTime: { type: Date, default: Date.now, required: true },
    attendanceDateEndTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attendance', attendanceSchema);