const jwt = require('jsonwebtoken');
// const Student = require('../testing/student.auth.model');  // Testing model
const Student = require('../models/student.auth.model');    // Actual model
const nodemailer = require('nodemailer');


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

async function forgot_passwd(req,student){

    // send mail to student email with password reset link
    function randomString(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
        return result;
    }

    const token = randomString(10);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    let link = "http://"+req.get('host')+"/verify?id="+token;

    const mailOptions = {
        from: process.env.EMAIL,
        to: student.email,
        subject: 'Password Reset Link',
        html: `Click <a href=${link}>here</a> to reset password`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

async function reset_passwd(token,old_pass,new_pass,student) {

}

module.exports = { createJWT,requireAuth, checkUser, reset_passwd, forgot_passwd }