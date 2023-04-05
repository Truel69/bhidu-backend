const { Router } = require('express');
const studentAuthController = require('../controllers/student.auth.controller');

const router = Router();

// Get routes for testing purposes
router.get('/signup', studentAuthController.signup_get);
router.get('/login', studentAuthController.login_get);
router.get('/logout', studentAuthController.logout_get);

// Email verification
router.get('/verify', studentAuthController.verify_get);

// Password forgot
router.get('/forgot', studentAuthController.forgot_get);
router.post('/forgot', studentAuthController.forgot_post);

// Password reset
router.get('/reset', studentAuthController.reset_get);
router.post('/reset', studentAuthController.reset_post);

// Password change
router.get('/change_pwd', studentAuthController.change_passwd_get);
router.post('/change_pwd', studentAuthController.change_passwd_post);

// Post routes
router.post('/signup', studentAuthController.signup_post);
router.post('/login', studentAuthController.login_post);

module.exports = router;