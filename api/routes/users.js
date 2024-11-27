const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const { upload } = require('../../configs/uploadConfig');

const UsersController = require('../controllers/users');

//ROUTERS
router.get('/test', UsersController.test);

router.get('/', UsersController.usersGetUser); //query

router.get('/logs', UsersController.getLogs);

router.get('/attendance/getAttendance', UsersController.usersGetAttendance)

router.get('/attendance/getByRange', UsersController.usersGetAttendanceByRange) //?startDate=2024-11-01&endDate=2024-11-30

router.get('/myProfile', checkAuth, UsersController.usersMyProfile);

router.get('/tokenValidation', UsersController.usersTokenValidation);

router.get('/signup/generateCode', UsersController.usersGenerateCode);

router.post('/signup/checkCode', UsersController.usersCheckCode);

router.post('/signup', upload.fields([{ name: 'userImage', maxCount: 1 }, { name: 'parentId', maxCount: 1 }, { name: 'schoolId', maxCount: 1 },]), UsersController.userSignup);

router.post('/login', UsersController.usersLogin);

router.post('/attendance/Login', UsersController.usersCreateAttendanceLogin);

router.put('/attendance/Logout', UsersController.usersCreateAttendanceLogout);

router.put('/update/:userId', UsersController.usersUpdateUser);


module.exports = router;