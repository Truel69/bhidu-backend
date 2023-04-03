const jwt = require('jsonwebtoken');
// const Student = require('../testing/student.auth.model');  // Testing model
const Student = require('../models/student.auth.model');    // Actual model


const createJWT = (id, duration) => {
     // 7 days
    
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: duration }
    );
};

const requireAuth = (req, res, next) => {
    
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
};

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {
                let user = await Student.findOne({where : {id : decodedToken.id}});
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

module.exports = { createJWT,requireAuth, checkUser }