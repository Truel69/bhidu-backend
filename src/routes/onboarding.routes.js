const { Router } = require('express');
const onboardingController = require('../controllers/onboardingController');
const { verifyAuth } = require('../middleware/authMiddleware');

const router = Router();

router.post('/onboarding1', onboardingController.onboarding_post1);
router.post('/onboarding2', onboardingController.onboarding_post2);

// Get route for testing
router.get('/onboarding', verifyAuth, (req, res) => {
    res.render('onboarding');
});

module.exports = router;