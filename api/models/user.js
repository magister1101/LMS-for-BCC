const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String },
    gender: { type: String, required: true, },
    contactNumber: { type: String, required: true },
    birthDate: { type: Date, default: "2000-01-01T00:00:00Z" },
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
    userImage: { type: String, required: true },
    parentId: { type: String, required: true, default: "none" },
    schoolId: { type: String, required: true, default: "none" },

    //title
    title: { type: String, required: true, default: "member" }, //member, instructor, admin
    attendanceCounter: { type: Number, required: true, default: 0 },
    rank: { type: Number, required: true, default: 0 },

    //archive checker
    isArchived: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);