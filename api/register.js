
const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let router = express.Router();

const Student = require('../models/student');

router.post('/', async (req, res) => {
    const { username, email, passwd } = req.body;

    // check if username and/or email already in use
    
    const user = await Student.findOne({ where: { username } })
        .catch(err => res.status(500).send("Server error"));
    if (user) return res.status(400).send("Username already in use");

    const newUser = await Student.create({
        username,
        email,
        passwd
    });
    const savedUser = await newUser.save()
                        .catch(err => res.status(500).send("Server error"));

});

router.get('/', (req, res) => {
    res.send("Registration page");
});

module.exports = router;
