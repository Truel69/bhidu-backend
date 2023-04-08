const { Router } = require('express');
const studentAuthController = require('../controllers/student.auth.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = Router();

// Routes for testing purposes
// router.get('/signup', studentAuthController.signup_get);
// router.get('/login', studentAuthController.login_get);
router.get('/logout', requireAuth, studentAuthController.logout_get);

// Email verification
router.get('/verify', studentAuthController.verify_get);

// Password forgot and reset
router.post('/forgot', studentAuthController.forgot_post);
// router.get('/reset', studentAuthController.reset_get);
router.post('/reset', studentAuthController.reset_post);

// Password change
router.post('/change_pwd', requireAuth, studentAuthController.change_passwd_post);

// Post routes
router.post('/signup', studentAuthController.signup_post);
router.post('/login', studentAuthController.login_post);

module.exports = router;