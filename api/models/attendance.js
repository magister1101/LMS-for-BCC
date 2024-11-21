const mongoose = require('mongoose');
const date = new Date();

const attendanceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: { type: String, required: true },
    attendanceDateStartTime: { type: Date, default: date, required: true },
    attendanceDateEndTime: { type: Date }
});

module.exports = mongoose.model('Attendance', attendanceSchema);