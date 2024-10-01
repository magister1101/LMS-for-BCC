const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const User = require('../models/user');

router.get('/', (req, res, next) => {
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
});

router.get('/test', (req, res, next) => {
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
});

router.post('/signup', (req, res, next) => {

    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Email already exists'
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
                            email: req.body.email,
                            password: hash,
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

});

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
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
                    const token =jwt.sign({
                        userId: user[0]._id,
                        email: user[0].email,
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

})


router.delete('/:userId', (req, res, next) => {
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
})

module.exports = router;