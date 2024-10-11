const mongoose = require('mongoose');

const signupCodeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    code: { type: String, required: true },
    expiresAt: { type: String, required: true },
    used: { type: Boolean, default: false },
});

module.exports = mongoose.model('SignupCode', signupCodeSchema);