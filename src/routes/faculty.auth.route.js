const { Router } = require('express');
const facultyAuthController = require('../controllers/faculty.auth.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = Router();

router.post('/signup', facultyAuthController.signup_post);
router.post('/login', facultyAuthController.login_post);

router.get('/logout', requireAuth, facultyAuthController.logout_get);
router.get('/verify', facultyAuthController.verify_get);

router.post('/forgot', facultyAuthController.forgot_post);
router.post('/reset', facultyAuthController.reset_post);
router.post('/change_pwd', requireAuth, facultyAuthController.change_passwd_post);

module.exports = router;