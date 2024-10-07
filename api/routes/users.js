const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const { upload } = require('../../configs/uploadConfig');

const UsersController = require('../controllers/users');

//ROUTERS
router.get('/', UsersController.users_get_all_user);

router.post('/signup', UsersController.users_create_user);

router.post('/login', UsersController.users_login);

router.delete('/:userId', checkAuth, UsersController.users_delete_user);

router.get('/test', UsersController.users_get_test);

module.exports = router;