const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const checkCode = require('../middleware/signup-auth');
const { upload } = require('../../configs/uploadConfig');

const UsersController = require('../controllers/users');

//ROUTERS
router.get('/', UsersController.users_get_all_user); //Prod: add checkauth middleware

router.get('/myprofile', checkAuth, UsersController.users_my_user);

router.get('/generateCode', UsersController.users_generate_code);

router.get('/checkCode', checkCode, UsersController.users_check_code);

router.get('/:userId', UsersController.users_get_user); //Prod: add checkauth middleware

router.post('/signup', upload.single('userImage'), UsersController.users_create_user);

router.post('/login', UsersController.users_login);

router.post('/attendance', UsersController.users_create_attendance);

router.put('/:userId', UsersController.users_archive_user);

router.delete('/:userId', UsersController.users_delete_user);

router.delete('/', UsersController.users_delete_all_user);

router.get('/test', UsersController.users_get_test);

module.exports = router;