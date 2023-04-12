const express = require('express');
const router = express.Router();

const studentAuth = require('../controllers/student.auth.controller');
const { requireAuth } = require('../middleware/auth.middleware');


router.post('/signup', auth.isLogOut, studentAuthController.signup_post);

// router.get('/logout', requireAuth, studentAuthController.logout_get);

// // Email verification
// router.get('/verify', studentAuthController.verify_get); 

// // Password forgot and reset
// router.post('/forgot', studentAuthController.forgot_post);

// router.post('/reset', studentAuthController.reset_post);

// // Password change
// router.post('/change_pwd', requireAuth, studentAuthController.change_passwd_post);

// // Post routes
// router.post('/signup', studentAuthController.signup_post);
// router.post('/login', studentAuthController.login_post);