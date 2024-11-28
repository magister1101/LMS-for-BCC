const mongoose = require('mongoose');

const configSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    logo: { type: String },
    staff01: { type: String },
    staff02: { type: String },
    staff03: { type: String },
    staff04: { type: String },
});

module.exports = mongoose.model('Config', configSchema);