const mongoose = require('mongoose');
const { upload } = require('../../configs/uploadConfigActivity');

const Course = require('../models/course'); //schema route
const User = require('../models/user'); //schema route
const Log = require('../models/log'); //schema route
const Config = require('../models/config'); //schema route

exports.getConfigs = async (req, res, next) => {
    try {
        Log.find()
            .then(logs => {
                return res.status(200).json(logs);
            })
            .catch(err => {
                console.log(err);
                return res.status(500).json({
                    message: "Error in retrieving logs"
                });
            })

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Error in retrieving configs"
        });
    }
}