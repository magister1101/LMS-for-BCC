const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const QRCode = require('qrcode');
const crypto = require('crypto');
const moment = require('moment');

const SignupCode = require('../models/signupCode');
const User = require('../models/user');
const Attendance = require('../models/attendance');
const Log = require('../models/log');
const Course = require('../models/course');


const performUpdate = (userId, updateFields, res) => {
    User.findByIdAndUpdate(userId, updateFields, { new: true })
        .then((updatedUser) => {
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(updatedUser);

        })
        .catch((err) => {
            return res.status(500).json({
                message: "Error in updating user",
                error: err
            });
        })
};

const performLog = async (userId, action, reference, key, res) => {
    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        var newReference = null;

        if (key === 'user') {
            const _user = await User.findOne({ _id: reference });
            newReference = _user.firstName + ' ' + _user.lastName + ' (USER)';
        }
        else if (key === 'course') {
            const _course = await Course.findOne({ _id: reference });
            newReference = _course.name + ' (COURSE)';
        }
        else if (key === 'activity') {
            const _activity = await Course.activities.findOne({ _id: reference });
            newReference = _activity.name + ' (ACTIVITY)';
        } else {
            return res.status(400).json({ message: 'Invalid key' });
        }

        const name = user.firstName + ' ' + user.lastName;

        const log = new Log({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            action: action,
            reference: newReference,
        });

        await log.save();
        return console.log({ message: 'Log saved successfully', log });

    } catch (err) {
        console.error('Error performing log:', err);
        if (res) {
            return res.status(500).json({
                message: 'Error in performing log',
                error: err.message
            });
        }
    }
};

exports.test = async (req, res, next) => {
    const userId = "6741ea588f282bd870e3eb88";
    const action = "updated";
    const reference = "6741ea588f282bd870e3eb88";
    const key = "user";

    await performLog(userId, action, reference, key, res)

    return res.status(200).json({ message: 'test' });
};

exports.usersGetUser = async (req, res, next) => {
    try {
        const { isArchived, query, filter } = req.query;

        // Helper function to escape special characters in regex
        const escapeRegex = (value) => {
            return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };

        let searchCriteria = {};
        const queryConditions = [];

        // Build query conditions based on 'query' parameter
        if (query) {
            const escapedQuery = escapeRegex(query);
            const orConditions = [];

            // Check for valid ObjectId
            if (mongoose.Types.ObjectId.isValid(query)) {
                orConditions.push({ _id: query });
            }

            // Add regex-based search conditions
            orConditions.push(
                { firstName: { $regex: escapedQuery, $options: 'i' } },
                { lastName: { $regex: escapedQuery, $options: 'i' } },
                { middleName: { $regex: escapedQuery, $options: 'i' } },
                { email: { $regex: escapedQuery, $options: 'i' } },
                { username: { $regex: escapedQuery, $options: 'i' } },
                { contactNumber: { $regex: escapedQuery, $options: 'i' } },
            );

            queryConditions.push({ $or: orConditions });
        }

        // Build filter-based conditions
        if (filter) {
            const escapedFilter = escapeRegex(filter);
            queryConditions.push({
                $or: [
                    { title: { $regex: escapedFilter, $options: 'i' } },
                    { school: { $regex: escapedFilter, $options: 'i' } },
                    { gender: { $regex: escapedFilter, $options: 'i' } },
                ],
            });
        }

        // Add isArchived condition if provided
        if (isArchived) {
            const isArchivedBool = isArchived === 'true'; // Convert to boolean
            queryConditions.push({ isArchived: isArchivedBool });
        }

        // Combine conditions into a single search criteria
        if (queryConditions.length > 0) {
            searchCriteria = { $and: queryConditions };
        }

        // Fetch users based on the search criteria
        const users = await User.find(searchCriteria);

        // Return the fetched users
        return res.status(200).json(users);

    } catch (error) {
        console.error('Error retrieving users:', error);
        return res.status(500).json({
            message: "Error in retrieving users",
            error: error.message || error,
        });
    }
};

// exports.getLogs = async (req, res, next) => {
//     try {
//         const { query, filter } = req.query;

//         const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

//         let searchCriteria = {};
//         const queryConditions = [];

//         if (query) {
//             const escapedQuery = escapeRegex(query);
//             const orConditions = [];

//             if (mongoose.Types.ObjectId.isValid(query)) {
//                 orConditions.push({ _id: query });
//             }
//             // Search by name or reference
//             orConditions.push(
//                 { name: { $regex: escapedQuery, $options: 'i' } },
//                 { reference: { $regex: escapedQuery, $options: 'i' } }
//             );
//             queryConditions.push({ $or: orConditions });
//         }

//         if (filter) {
//             const escapedFilter = escapeRegex(filter);
//             queryConditions.push({
//                 $or: [{ action: { $regex: escapedFilter, $options: 'i' } }],
//             });
//         }

//         if (queryConditions.length > 0) {
//             searchCriteria = { $and: queryConditions };
//         }

//         const logs = await Log.find(searchCriteria);

//         const activityStrings = logs.map((log) => {
//             const { name, action, reference, timestamp } = log;

//             let referenceString = reference;
//             if (typeof reference === 'object') {
//                 referenceString = JSON.stringify(reference)
//                     .replace(/\\\"/g, '')      // Remove escaped double quotes
//                     .replace(/{|}/g, '')       // Remove curly braces
//                     .replace(/\"/g, '')        // Remove remaining double quotes
//                     .trim();                   // Trim any extra spaces
//             }

//             // Format the timestamp to MM/DD/YYYY
//             const date = new Date(timestamp);
//             const month = date.getMonth() + 1; // getMonth() returns a zero-indexed value, so we add 1
//             const day = date.getDate();
//             const year = date.getFullYear();

//             const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;

//             // Return the formatted string
//             return { entry: `${name} ${action} ${referenceString} on ${formattedDate}` };
//         });

//         return res.status(200).json({ logs: activityStrings });
//     } catch (err) {
//         console.error('Error retrieving log:', err);
//         return res.status(500).json({
//             message: 'Error in retrieving log',
//             error: err.message,
//         });
//     }
// };

exports.getLogs = async (req, res, next) => {
    try {
        const { query, filter } = req.query;

        const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        let searchCriteria = {};
        const queryConditions = [];

        if (query) {
            const escapedQuery = escapeRegex(query);
            const orConditions = [];

            if (mongoose.Types.ObjectId.isValid(query)) {
                orConditions.push({ _id: query });
            }
            // Search by name or reference
            orConditions.push(
                { name: { $regex: escapedQuery, $options: 'i' } },
                { reference: { $regex: escapedQuery, $options: 'i' } }
            );
            queryConditions.push({ $or: orConditions });
        }

        if (filter) {
            const escapedFilter = escapeRegex(filter);
            queryConditions.push({
                $or: [{ action: { $regex: escapedFilter, $options: 'i' } }],
            });
        }

        if (queryConditions.length > 0) {
            searchCriteria = { $and: queryConditions };
        }

        const logs = await Log.find(searchCriteria);

        return res.status(200).json({ logs });
    } catch (err) {
        console.error('Error retrieving log:', err);
        return res.status(500).json({
            message: 'Error in retrieving log',
            error: err.message,
        });
    }
};

exports.usersGetAttendance = async (req, res, next) => {
    try {
        const { query, filter } = req.query;

        const escapeRegex = (value) => {
            return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };

        let searchCriteria = {};
        const queryConditions = [];

        // Build query conditions based on 'query' parameter
        if (query) {
            const escapedQuery = escapeRegex(query);
            const orConditions = [];

            if (mongoose.Types.ObjectId.isValid(query)) {
                orConditions.push({ _id: query });
            }

            orConditions.push(
                { user_id: { $regex: escapedQuery, $options: 'i' } },

            );
            queryConditions.push({ $or: orConditions });
        }

        if (filter) {
            const escapedFilter = escapeRegex(filter);
            queryConditions.push({
                $or: [
                    { attendanceDateStartTime: { $regex: escapedFilter, $options: 'i' } },

                ],
            });
        }


        if (queryConditions.length > 0) {
            searchCriteria = { $and: queryConditions };
        }

        // Fetch users based on the search criteria
        const users = await Attendance.find(searchCriteria);

        // Return the fetched users
        return res.status(200).json(users);

    } catch (error) {
        console.error('Error retrieving users:', error);
        return res.status(500).json({
            message: "Error in retrieving users",
            error: error.message || error,
        });
    }
};

exports.usersGetAttendanceByRange = async (req, res, next) => {
    try {
        // Extract the `startDate` and `endDate` from query parameters
        const { startDate, endDate } = req.query;

        // Validate date inputs
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Please provide both startDate and endDate in the query.' });
        }

        // Convert the date strings to JavaScript Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Ensure valid dates
        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        // Query the database for attendance records within the range
        const attendances = await Attendance.find({
            attendanceDateStartTime: {
                $gte: start,
                $lte: end,
            },
        }).lean(); // Convert MongoDB BSON objects to plain JS objects

        // Transform the BSON format to a JSON-compatible format
        const formattedAttendances = attendances.map((record) => ({
            _id: record._id.toString(), // Convert ObjectId to string
            user_id: record.user_id,
            attendanceDateStartTime: record.attendanceDateStartTime?.toISOString(), // Convert Date to ISO string
            attendanceDateEndTime: record.attendanceDateEndTime?.toISOString(), // Handle optional Date
            ...record, // Include other fields in the document
        }));

        // Return the formatted results
        return res.status(200).json(formattedAttendances);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.usersMyProfile = (req, res, next) => {
    User.find({ _id: req.userData.userId })
        .exec()
        .then(user => {
            return res.status(200).json(user);
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            });
        });
};

exports.usersTokenValidation = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(200).json({ isValid: false });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.json({ isValid: true });
    } catch (error) {
        return res.status(500).json({ isValid: false });
    }
};

exports.usersGenerateCode = (req, res, next) => {

    const code = crypto.randomBytes(3).toString('hex');
    const expiresAt = moment().add(59, 'minutes').toISOString();

    const signupCode = new SignupCode({
        _id: new mongoose.Types.ObjectId(),
        code: code,
        expiresAt: expiresAt,
        used: false,
    });
    signupCode
        .save()
        .then(result => {
            return res.status(201).json({
                message: 'Signup code generated successfully',
                code: result,
            });
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            });
        })
};

exports.usersCheckCode = (req, res, next) => {
    SignupCode.findOne({ code: req.body.code })
        .exec()
        .then(code => {
            if (!code) {
                return res.status(200).json({ message: 'Invalid or missing code' });
            }

            if (code.used) {
                return res.status(200).json({ message: 'Code has already been used' });
            }

            const now = moment();
            const { expiresAt } = code;

            // Check if the code has expired
            if (now.isAfter(expiresAt)) {
                return res.status(200).json({ message: 'Code has expired' });
            }

            // Code is valid, mark it as used
            code.used = true;
            code.save()
                .then(() => {
                    return res.status(200).json({ isValid: true });
                })
                .catch(err => {
                    // Handle any errors that occur while saving
                    return res.status(500).json({ error: 'Failed to update code as used' });
                });
        })
        .catch(err => {
            // Handle any errors that occur during the database query
            return res.status(500).json({ error: err.message });
        });
};

exports.userSignup = async (req, res, next) => {
    try {
        // Check if the username or email already exists
        const existingUser = await User.find({
            $or: [{ username: req.body.username }, { email: req.body.email }]
        });

        if (existingUser.length >= 1) {
            return res.status(409).json({
                message: 'Email or username already exists',
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const { userImage, parentId, schoolId } = req.files;
        if (!userImage || !parentId || !schoolId) {
            return res.status(400).json({
                message: 'All three files (userImage, parentId, schoolId) are required.',
            });
        }

        // Create a new user instance
        const userId = new mongoose.Types.ObjectId();
        const user = new User({
            _id: userId,
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            middleName: req.body.middleName,
            gender: req.body.gender,
            contactNumber: req.body.contactNumber,
            birthDate: new Date(req.body.birthDate),
            school: req.body.school,
            // Address
            country: req.body.country,
            zipCode: req.body.zipCode,
            province: req.body.province,
            municipality: req.body.municipality,
            barangay: req.body.barangay,
            street: req.body.street,
            blockAndLot: req.body.blockAndLot,
            // Guardian info
            guardianFirstName: req.body.guardianFirstName,
            guardianLastName: req.body.guardianLastName,
            guardianMiddleName: req.body.guardianMiddleName,
            guardianContactNumber: req.body.guardianContactNumber,
            // Guardian address
            guardianCountry: req.body.guardianCountry,
            guardianZipCode: req.body.guardianZipCode,
            guardianProvince: req.body.guardianProvince,
            guardianMunicipality: req.body.guardianMunicipality,
            guardianBarangay: req.body.guardianBarangay,
            guardianStreet: req.body.guardianStreet,
            guardianBlockAndLot: req.body.guardianBlockAndLot,
            // File paths
            userImage: userImage[0].path, // Primary image
            parentId: parentId[0].path,   // First additional file
            schoolId: schoolId[0].path,  // Second additional file
        });


        const savedUser = await user.save();

        return res.status(201).json({
            message: 'User created successfully',
            user: savedUser,
        });
    } catch (error) {
        // Catch and handle errors
        return res.status(500).json({
            message: 'An error occurred during user signup',
            error: error.message,
        });
    }
};


exports.usersLogin = (req, res, next) => {
    User.find({ username: req.body.username })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth Failed (UserName Not found)'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth Failed (incorrect Password)'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        userId: user[0]._id,
                        username: user[0].username,
                    },
                        process.env.JWT_SECRET, //private key
                        {
                            expiresIn: "8h" //key expires in # hour
                        }
                    )

                    return res.status(200).json({
                        message: 'Auth Successful',
                        token: token,
                    });
                }
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })

};

exports.usersCreateAttendanceLogin = (req, res, next) => {
    const userId = req.body.user_id
    console.log(userId)
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)); // Start of the day
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999)); // End of the day
    Attendance.findOne({
        user_id: userId,
        attendanceDateStartTime: {
            $gte: startOfDay, //gte greatr than or equal to
            $lte: endOfDay  //lte less than or equal to
        }
    })
        .then(existingAttendance => {
            if (existingAttendance) {
                return res.status(409).json({
                    message: 'Attendance already recorded for the day'
                })
            } else {
                const attendance = new Attendance({
                    _id: new mongoose.Types.ObjectId(),
                    user_id: userId,
                });
                attendance
                    .save()
                    .then(result => {
                        return res.status(201).json({
                            message: 'Attendance recorded successfully',
                            attendance: result,
                        })
                    })
            }
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            });
        });
};

exports.usersCreateAttendanceLogout = (req, res, next) => {
    const userId = req.body.user_id;
    console.log("User ID:", userId);

    const currentDate = new Date();
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(0, 0, 0, 0); // Start of the day
    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999); // End of the day

    Attendance.findOne({
        user_id: userId,
        attendanceDateStartTime: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    })
        .then(existingAttendance => {
            if (existingAttendance) {
                if (existingAttendance.attendanceDateEndTime) {
                    // If logout time already exists, return a conflict response
                    return res.status(409).json({
                        message: 'Logout time already recorded for the day',
                    });
                }

                const attendanceId = existingAttendance._id;

                // Update the attendance record with the logout time
                return Attendance.findByIdAndUpdate(
                    attendanceId,
                    { attendanceDateEndTime: new Date() }, // Set current time as logout time
                    { new: true } // Return the updated document
                ).then(updatedAttendance => {
                    console.log("Updated Attendance:", updatedAttendance);
                    return res.status(200).json({
                        message: 'Logout time recorded successfully',
                        attendance: updatedAttendance,
                    });
                });
            } else {
                // No attendance record found for the day
                return res.status(409).json({
                    message: 'No attendance record found for the day',
                });
            }
        })
        .catch(err => {
            console.error("Error:", err);
            return res.status(500).json({
                error: err.message || 'An error occurred while processing the request',
            });
        });
};

exports.usersUpdateUser = async (req, res, next) => {
    const userId = req.params.userId;
    const updateFields = req.body;
    await performLog(userId, "updated", updateFields, res)

    if (updateFields.password) {
        const bcrypt = require('bcrypt');
        const saltRounds = 10;

        bcrypt.hash(updateFields.password, saltRounds, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    message: "Error in hashing password",
                    error: err
                });
            }
            updateFields.password = hash;
            performUpdate(userId, updateFields, res);
        });
    }
    else {
        performUpdate(userId, updateFields, res);
    }
};





