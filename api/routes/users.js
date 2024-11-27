const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const { upload } = require('../../configs/uploadConfig');

const UsersController = require('../controllers/users');

//ROUTERS
router.get('/test', UsersController.test);

router.get('/', UsersController.users_get_all_user);

router.get('/getLogs', UsersController.viewLogs);

router.get('/attendance/getByRange', UsersController.users_get_attendanceByRange)

router.get('/myProfile', checkAuth, UsersController.users_my_user);

router.get('/tokenValidation', UsersController.users_token_validation);

router.get('/generateCode', UsersController.users_generate_code);

router.get('/:userId', UsersController.users_get_user);

router.post('/checkCode', UsersController.users_check_code);

router.post('/signup', upload.single('userImage'), UsersController.users_create_user); // add multiple data, photocopy of parents ID, and photocopy of student ID

router.post('/login', UsersController.users_login);

router.post('/attendance/Login', UsersController.users_create_attendanceLogin);

router.put('/attendance/Logout', UsersController.users_create_attendanceLogout);

router.put('/update/:userId', UsersController.users_update_user);

router.delete('/:userId', UsersController.users_delete_user);

router.delete('/deleteAll', UsersController.users_delete_all_user);


module.exports = router;