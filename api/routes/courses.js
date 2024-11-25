const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const { upload } = require('../../configs/uploadConfigActivity')

const CoursesController = require('../controllers/courses');

//ROUTERS
router.get('/', CoursesController.courses_get_all_course);

// router.get('/:id', CoursesController.courses_get_course);

router.post('/', upload.single('courseFile'), CoursesController.courses_create_course);

router.put('/update/:id', CoursesController.courses_update_course);

router.put('/addActivity/:id', upload.single('activityFile'), CoursesController.courses_add_activity);

router.put('/updateActivity/:courseId/:activityId', CoursesController.courses_update_activity);

router.delete('/:id', CoursesController.courses_delete_course);

module.exports = router;