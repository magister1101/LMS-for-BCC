const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.users_get_all_user = (req, res, next) => {
    User.find()
        .exec()
        .then(doc => {
            const response = {
                number_of_users: doc.length,
                users: doc
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

exports.users_get_user = (req, res, next) => {
    User.find({ _id: req.params.userId })
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

exports.users_my_user = (req, res, next) => {
    User.find({ _id: req.userData.userId })
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

exports.users_create_user = (req, res, next) => {

    User.find({ $or: [{ username: req.body.username }, { email: req.body.email }] })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Email or username already exists '
                })
            }
            else {

                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {

                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            password: hash,
                            email: req.body.email,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            middleName: req.body.middleName,
                            gender: req.body.gender,
                            contactNumber: req.body.contactNumber,
                            birthDate: new Date(req.body.birthDate),
                            //address
                            country: req.body.country,
                            zipCode: req.body.zipCode,
                            province: req.body.province,
                            municipality: req.body.municipality,
                            barangay: req.body.barangay,
                            street: req.body.street,
                            blockAndLot: req.body.blockAndLot,
                            //guardian info
                            guardianFirstName: req.body.guardianFirstName,
                            guardianLastName: req.body.guardianLastName,
                            guardianMiddleName: req.body.guardianMiddleName,
                            guardianContactNumber: req.body.guardianContactNumber,
                            //guardian address
                            guardianCountry: req.body.guardianCountry,
                            guardianZipCode: req.body.guardianZipCode,
                            guardianProvince: req.body.guardianProvince,
                            guardianMunicipality: req.body.guardianMunicipality,
                            guardianBarangay: req.body.guardianBarangay,
                            guardianStreet: req.body.guardianStreet,
                            guardianBlockAndLot: req.body.guardianBlockAndLot,
                            //userimage
                            userImage: req.file.path,
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created successfully'
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

exports.users_login = (req, res, next) => {
    User.find({ username: req.body.username })
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
        .catch()

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

exports.users_delete_all_user = (req, res, next) => {
    User.deleteMany({})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "All users deleted",
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