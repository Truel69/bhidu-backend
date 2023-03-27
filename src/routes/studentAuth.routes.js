const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

// Get routes for testing purposes

router.get('/signup', authController.signup_get);
router.get('/login', authController.login_get);

// Email verification
router.get('/verify/:token', authController.verify_get);

router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);

module.exports = router;