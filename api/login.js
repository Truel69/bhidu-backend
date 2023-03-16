const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let router = express.Router();

const Student = require('../models/student');

router.post('/', async (req, res) => {
    const { email, passwd } = req.body;

    // check if username and/or email already in use
    
    const user = await Student.findOne({ where: { email } })
                        .catch(err => res.status(500).send("Server error : ",err));
    
    if(!user) return res.status(400).send("Email not found");

    if (user.passwd !== passwd) return res.status(400).send("Wrong password");

    res.send("Login successful");

});

router.get('/', (req, res) => {
    res.send("Registration page");
});

module.exports = router;