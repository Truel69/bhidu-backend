require('dotenv').config();
const express = require("express");
const path = require("path");

const app = express();

app.route('/signup')
    .get((req, res) => {
        res.send('Register a new user');
    })
    .post((req, res) => {
        res.send('Add a new user');
    })
;


app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/landing-page/build/index.html'));
});
