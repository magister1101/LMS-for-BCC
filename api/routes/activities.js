const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const { upload } = require('../../configs/uploadConfigActivity')

const ActivitiesController = require('../controllers/activities'); //controller for functions

//ROUTERS
router.get('/', checkAuth, ActivitiesController.activities_get_all_activity);

router.get('/:activityId', checkAuth, ActivitiesController.activities_get_activity);

router.post('/', checkAuth, upload.single('activityFile'), ActivitiesController.activities_create_activity);

router.put('/:activityId', checkAuth, ActivitiesController.activities_archive_activity);

router.patch('/:activityId', checkAuth, ActivitiesController.activities_update_activity);

router.delete('/:activityId', checkAuth, ActivitiesController.activities_delete_activity);

router.delete('/', checkAuth, ActivitiesController.activities_delete_all_activity); //Delete all is for Staging purposes only

module.exports = router;