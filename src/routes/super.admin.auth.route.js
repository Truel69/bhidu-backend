const { Router } = require('express');
const superAdminAuthController = require('../controllers/super.admin.auth.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = Router();

router.post('/signup', superAdminAuthController.signup_post);
router.post('/login', superAdminAuthController.login_post);

router.get('/logout', requireAuth, superAdminAuthController.logout_get);

router.get('/verify', superAdminAuthController.verify_get);

router.post('/forgot', superAdminAuthController.forgot_post);
router.post('/reset', superAdminAuthController.reset_post);
router.post('/change_pwd', superAdminAuthController.change_passwd_post);

module.exports = router;