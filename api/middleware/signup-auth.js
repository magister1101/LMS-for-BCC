const moment = require('moment');
const SignupCode = require('../models/signupCode');
const { error } = require('console');


module.exports = (req, res, next) => {
    SignupCode.findOne({ code: req.body.code })
        .exec()
        .then(code => {
            if (!code) {
                return res.status(400).json({ message: 'Invalid or missing code' });
            }
            if (code.used) {
                return res.status(400).json({ message: 'Code has already been used' });
            }

            const now = moment();
            const { expiresAt, used } = code;

            // Check if the code is expired
            if (now.isAfter(expiresAt)) {
                return res.status(400).json({ message: 'Code has expired' });
            }

            code.used = true;
            code.save()
            // Code is valid and not expired
            next();
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
};