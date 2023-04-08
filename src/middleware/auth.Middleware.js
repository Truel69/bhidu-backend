const jwt = require('jsonwebtoken');
//const Student = require('../models/student.auth.model');    // Actual model
const Student = require('../mongo.models/student.model');  // Testing model
const bcrypt = require('bcrypt');
const { randomString } = require('../middleware/token.gen.middleware');
const { sendMail } = require('../middleware/mailing.middleware');

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

// Check if user is logged in
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {
                let user = await Student.findOne({id: decodedToken.id});
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

// Handle password forgot request
async function forgot_passwd(host,student){

    const token = await randomString(10);
    
    student.reset_token = token;
    student.reset_token_expires = Date.now() + 3600000; // 1 hour

    await student.save();

    let link = `https://${host}/reset?id=${token}`;
    let sender = `Bhidu Help <${process.env.mail}>`;
    let subject = "Password reset request";
    let content = `Click <a href="${link}">here</a> to reset your password`;

    const mail = await sendMail(student.email, sender, subject, content);

    return mail;

}

async function reset_passwd(username,forgot,new_passwd,confirm_passwd) {

    if(!username) {
        throw("Invalid user - none provided");
    }

    // const student = await Student.findOne({where : {reset_token : token}});
    const student = await Student.findOne({username : username});

    if (!student) {
        throw("User does not exist");
    }

    if(!forgot.bool) {
        // If reset request is not from forgot password page then request will be from change password page -> verify old password
        const auth = await bcrypt.compare(forgot.old_passwd, student.passwd);
        if (!auth) {
            throw("Wrong password entered");
        }
    } else {
        // Reset request comes from forgot page -> verify token
        if (student.reset_token != forgot.token) {
            throw("Invalid token for user");
        }

        // check token expiry
        if (student.reset_token_expires < Date.now()) {
            throw("Token expired");
        }

        student.reset_token = "";
        student.reset_token_expires = "";
    }
    
    if (new_passwd != confirm_passwd) {
        throw("Passwords do not match");
    }

    const salt = await bcrypt.genSalt(10);
    student.passwd = await bcrypt.hash(new_passwd, salt);

    await student.save();

    return student;

}

module.exports = { createJWT, requireAuth, checkUser, reset_passwd, forgot_passwd }