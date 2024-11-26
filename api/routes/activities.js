const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const { upload } = require('../../configs/uploadConfigActivity')

const ActivitiesController = require('../controllers/activities'); //controller for functions

//ROUTERS
router.get('/', ActivitiesController.activities_get_all_activity);

router.get('/:activityId', ActivitiesController.activities_get_activity);

router.post('/', upload.single('activityFile'), ActivitiesController.activities_create_activity);

router.put('/update/:id', ActivitiesController.activities_update_activity);

module.exports = router;