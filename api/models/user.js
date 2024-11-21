const mongoose = require('mongoose');
const { type } = require('os');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String },
    gender: { type: String, required: true, },
    contactNumber: { type: String, required: true, default: "none" },
    birthDate: { type: Date, required: true, default: "none" },
    school: { type: String, required: true, default: "none" },

    //address
    country: { type: String, required: true, default: "none" },
    zipCode: { type: String, required: true, default: "none" },
    province: { type: String, required: true, default: "none" },
    municipality: { type: String, required: true, default: "none" },
    barangay: { type: String, required: true, default: "none" },
    street: { type: String, required: true, default: "none" },
    blockAndLot: { type: String, required: true, default: "none" },

    //guardian info
    guardianFirstName: { type: String, required: true, default: "none" },
    guardianLastName: { type: String, required: true, default: "none" },
    guardianMiddleName: { type: String },
    guardianContactNumber: { type: String, required: true, default: "none" },

    //guardian address
    guardianCountry: { type: String, required: true, default: "none" },
    guardianZipCode: { type: String, required: true, default: "none" },
    guardianProvince: { type: String, required: true, default: "none" },
    guardianMunicipality: { type: String, required: true, default: "none" },
    guardianBarangay: { type: String, required: true, default: "none" },
    guardianStreet: { type: String, required: true, default: "none" },
    guardianBlockAndLot: { type: String, required: true, default: "none" },

    //image
    qrCode: { type: String },
    userImage: { type: String, required: true },

    //title
    title: { type: String, required: true, default: "member" }, //member, instructor, admin
    rank: { type: Number, required: true, default: 0 },

    //archive checker
    isArchived: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);