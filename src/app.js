require('dotenv').config();
const mongoose = require("mongoose");
const express = require("express");
// const session = require('express-session'); 
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const { checkUser } = require("./middleware/auth.middleware");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


// Testing with barebones frontend
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));

// Mongoose connection
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
});


// Error handling
// app.use((req, res, next) => {
//     const error = new Error("Not found");
//     error.status = 404;
//     next(error);
// });

// app.use((error, req, res, next) => {
//     res.status(error.status || 500);
//     res.json({
//         error: {
//             message: error.message
//         }
//     });
// });

app.get('*',checkUser);

// student authentication ruotes
const studentAuthRoutes = require("./routes/student.auth.route");
app.use('/student',studentAuthRoutes);

// Super Admin authentication routes
const superAdminAuthRoutes = require("./routes/super.admin.auth.route");
app.use('/superadmin',superAdminAuthRoutes);

// Faculty authentication routes
// const facultyAuthRoutes = require("./routes/faculty.auth.route.js");
// app.use('/faculty',facultyAuthRoutes);

// Onbbording routes
// const oboardingRoutes = require("./routes/onboarding.route");
// app.use(oboardingRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000 => http://localhost:3000/");
});
