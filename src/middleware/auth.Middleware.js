const jwt = require('jsonwebtoken');
//const Student = require('../models/student.auth.model');    // Actual model
const Student = require('../mongo.models/student.model');  // Testing model
const Faculty = require('../mongo.models/faculty.model');
const SuperAdmin = require('../mongo.models/super.admin.model');


// Generate jwt token for user id [UUID]
const createJWT = (id, duration) => {
     // 7 days
    
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: duration }
    );
};

// For requests to pages with required authentication
const requireAuth = async(req, res, next) => {
    
    const token = req.cookies.jwt;

    if (token) {
        await jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                // res.redirect('/login');
                res.send('You are not logged in');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.send('You are not logged in');
        // res.redirect('/login');
    }
};

// Check if user is logged in and set local variable user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {
                let user = await Student.findOne({id: decodedToken.id}) || await Faculty.findOne({id: decodedToken.id}) || await SuperAdmin.findOne({id: decodedToken.id});
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

module.exports = { createJWT, requireAuth, checkUser };