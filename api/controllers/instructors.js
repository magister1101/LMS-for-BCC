const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const QRCode = require('qrcode');

const Instructor = require('../models/instructor');
const { error } = require('console');


exports.instructors_get_all_instructor = (req, res, next) => {
    Instructor.find()
        .exec()
        .then(doc => {
            const response = {
                number_of_users: doc.length,
                Instructor: doc
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.instructors_get_instructor = (req, res, next) => {
    Instructor.find({ _id: req.params.userId })
        .exec()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.instructors_my_instructor = (req, res, next) => {
    Instructor.find({ _id: req.userData.userId })
        .exec()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.instructors_create_instructor = (req, res, next) => {

    Instructor.find({ $or: [{ username: req.body.username }, { email: req.body.email }] })
        .exec()
        .then(instructor => {
            if (instructor.length >= 1) {
                return res.status(409).json({
                    message: 'Email or username already exists '
                });
            }
            else {

                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {

                        const userId = new mongoose.Types.ObjectId();

                        const instructor = new Instructor({
                            _id: userId,
                            username: req.body.username,
                            password: hash,
                            email: req.body.email,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            middleName: req.body.middleName,
                            gender: req.body.gender,
                            userImage: req.file.path,
                        });
                        instructor
                            .save()
                            .then(async result => {
                                const qrCodeFilePath = path.join(__dirname, '../../uploads', `qrcode-${userId}.png`);

                                QRCode.toFile(qrCodeFilePath, userId.toString(), (err) => {
                                    if (err) {
                                        console.log('Error Generating QR Code ', err);
                                        res.status(500).json({
                                            message: "Error Generating QR Code",
                                            errir: err
                                        });
                                    }

                                    instructor.qrCode = qrCodeFilePath;
                                    instructor.save();

                                    console.log(result);
                                    res.status(201).json({
                                        message: 'Instructor created successfully',
                                        user: result,
                                        qrCodefilePath: qrCodeFilePath,
                                    })
                                })


                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            })
                    }
                })
            }
        })

};

exports.instructors_login_instructor = (req, res, next) => {
    Instructor.find({ username: req.body.username })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth Failed'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        userId: user[0]._id,
                        username: user[0].username,
                    },
                        process.env.JWT_SECRET, //private key
                        {
                            expiresIn: "1h" //key expires in 1 hour
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
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.users_delete_user = (req, res, next) => {
    const id = req.params.userId
    User.deleteOne({
        _id: id
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User Deleted',
            })
        })
        .catch(err => {
            console.log(err),
                res.status(500).json({
                    error: err
                })
        })
};

exports.instructors_delete_all_instructor = (req, res, next) => {
    Instructor.deleteMany({})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "All Instructors deleted",
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.users_get_test = (req, res, next) => {
    User.find()
        .exec()
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};