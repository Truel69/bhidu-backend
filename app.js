require('dotenv').config();
const express = require("express");
const session = require('express-session'); 
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API
const api = require("./api");
app.use('/api',api);


app.listen(3000, () => {
    console.log("Server running on port 3000 => http://localhost:3000/");
});
