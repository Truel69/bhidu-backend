const { Router } = require('express');
const onboardingController = require('../controllers/onboarding.controller');

const router = Router();

router.post('/onboarding1', onboardingController.onboarding_post1);
router.post('/onboarding2', onboardingController.onboarding_post2);

// Get route for testing
router.get('/onboarding', (req, res) => res.send('Onboarding route'));

module.exports = router;