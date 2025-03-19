const express = require('express');
const registerUser = require('../controller/RegisterUser');
const checkEmail = require('../controller/CheckEmail');
const checkPassword = require('../controller/CheckPassword');
const UserDetail = require('../controller/UserDetail')
const LogOut = require('../controller/LogOut');
const UpdateUserDetails = require('../controller/UpdateUserDetails');
const SearchUser = require('../controller/SearchUser');


const router = express.Router();


router.post('/register', registerUser);
router.post('/email', checkEmail);
router.post('/password', checkPassword);
router.get('/user-details', UserDetail);
router.get('/logout', LogOut);
router.post('/UpdateUserDetails', UpdateUserDetails);
router.post('/search-user',SearchUser);

module.exports = router;
