const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const { upload } = require('../../configs/uploadConfigActivity')

const CoursesController = require('../controllers/courses');

//ROUTERS
router.get('/', CoursesController.coursesGetCourse);

router.get('/activity/:courseId/:activityId', CoursesController.getActivityById);

router.post('/activity/submit/:courseId/:activityId', checkAuth, upload.single('file'), CoursesController.submitActivity);

router.post('/', upload.single('file'), CoursesController.coursesCreateCourse);

router.put('/update/:id', CoursesController.coursesUpdateCourse);

router.put('/activity/add/:id', checkAuth, upload.single('file'), CoursesController.coursesAddActivity);

router.put('/submission/update/:courseId/:activityId/:submissionId', checkAuth, CoursesController.activityUpdateSubmission);

router.put('/activity/update/:courseId/:activityId', checkAuth, CoursesController.coursesUpdateActivity);

module.exports = router;