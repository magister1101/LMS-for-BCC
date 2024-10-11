const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const { upload } = require('../../configs/uploadConfig');

const InstructorsController = require('../controllers/instructors');

//ROUTERS

router.get('/', InstructorsController.instructors_get_all_instructor); //Prod: add checkauth middleware

router.get('/myprofile', checkAuth, InstructorsController.instructors_my_instructor);

router.get('/:userId', InstructorsController.instructors_get_instructor); //Prod: add checkauth middleware

router.post('/signup', upload.single('userImage'), InstructorsController.instructors_create_instructor);

router.post('/login', InstructorsController.instructors_login_instructor);

router.delete('/', InstructorsController.instructors_delete_all_instructor);


module.exports = router;