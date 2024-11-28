const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const { upload } = require('../../configs/uploadConfigActivity')

const ConfigController = require('../controllers/configs');

//ROUTERS

router.post('/signup', upload.fields([{ name: 'userImage', maxCount: 1 }, { name: 'parentId', maxCount: 1 }, { name: 'schoolId', maxCount: 1 },]), ConfigController.getConfigs);


module.exports = router;