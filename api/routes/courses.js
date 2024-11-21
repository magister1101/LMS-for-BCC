const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const CoursesController = require('../controllers/courses');

//ROUTERS
router.get('/', CoursesController.courses_get_all_course);

router.get('/:id', CoursesController.courses_get_course);

router.post('/', CoursesController.courses_create_course);

router.put('/update/:id', CoursesController.courses_update_course);

router.delete('/:id', CoursesController.courses_delete_course);


module.exports = router;