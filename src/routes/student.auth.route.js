const { Router } = require('express');
const studentAuthController = require('../controllers/student.auth.controller');

const router = Router();

// Get routes for testing purposes
router.get('/signup', studentAuthController.signup_get);
router.get('/login', studentAuthController.login_get);

// Email verification
router.get('/verify', studentAuthController.verify_get);

// Password reset
router.get('/reset', studentAuthController.reset_get);
router.post('/reset', studentAuthController.reset_post);

// Post routes
router.post('/signup', studentAuthController.signup_post);
router.post('/login', studentAuthController.login_post);

module.exports = router;