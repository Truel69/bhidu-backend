const express = require('express');

let router = express.Router();

router.get('/', (req, res) => {
    res.send("API");
});

const register = require('./register');
router.use('/register', register);

module.exports = router;

