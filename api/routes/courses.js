const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const CoursesController = require('../controllers/courses');

//ROUTERS
router.get('/', checkAuth, CoursesController.courses_get_all_course);

router.post('/', checkAuth, CoursesController.courses_create_course);

router.get('/:courseId', checkAuth, CoursesController.courses_get_course);

router.patch('/:courseId', checkAuth, CoursesController.courses_update_course);

router.delete('/:courseId', checkAuth, CoursesController.courses_delete_course);


module.exports = router;