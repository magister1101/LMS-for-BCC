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
    gender: { type: String, required: true },
    contactNumber: { type: String, required: true },
    birthDate: { type: Date, required: true },
    school: { type: String, required: true },

    //address
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    province: { type: String, required: true },
    municipality: { type: String, required: true },
    barangay: { type: String, required: true },
    street: { type: String, required: true },
    blockAndLot: { type: String, required: true },

    //guardian info
    guardianFirstName: { type: String, required: true },
    guardianLastName: { type: String, required: true },
    guardianMiddleName: { type: String },
    guardianContactNumber: { type: String, required: true },

    //guardian address
    guardianCountry: { type: String, required: true },
    guardianZipCode: { type: String, required: true },
    guardianProvince: { type: String, required: true },
    guardianMunicipality: { type: String, required: true },
    guardianBarangay: { type: String, required: true },
    guardianStreet: { type: String, required: true },
    guardianBlockAndLot: { type: String, required: true },

    //image
    qrCode: { type: String },
    userImage: { type: String, required: true },

    //title
    title: { type: String, required: true, default: "Member" },
    rank: { type: number, required: true, default: 0 },

    //archive checker
    isArchived: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);