const jwt = require('jsonwebtoken');
//const Student = require('../models/student.auth.model');    // Actual model
const Student = require('../testing/student.auth.model');  // Testing model
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

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
                // let user = await Student.findOne({where : {id : decodedToken.id}});
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
    
    student.reset_token = token;
    student.reset_token_expires = Date.now() + 3600000; // 1 hour

    await student.save();

    acc = {
        user: process.env.mail,
        pass: process.env.mail_pass
    }

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: acc.user, 
            pass: acc.pass, 
        },
        tls: {
            rejectUnauthorized: false
        }

    });

    let link = "http://"+req.get('host')+"/reset?id="+token;

    const mailOptions = {
        from: process.env.EMAIL,
        to: student.email,
        subject: 'Password Reset Link',
        html: `Click <a href=${link}>here</a> to reset password <br> Expires in one hour`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

async function reset_passwd(username,token ,old_passwd,new_passwd,confirm_passwd) {

    if(!username) {
        throw("Invalid user");
    }

    if(!token) {
        throw("Invalid token");
    }

    // const student = await Student.findOne({where : {reset_token : token}});
    const student = await Student.findOne({username : username});

    if (!student) {
        throw("User does not exist");
    }

    if (student.reset_token != token) {
        throw("Invalid token for user");
    }

    if (student.reset_token_expires < Date.now()) {
        throw("Token expired");
    }

    const verify_old = await bcrypt.compare(old_passwd, student.passwd);

    if (!verify_old) {
        throw("Incorrect password");
    }

    if (new_passwd != confirm_passwd) {
        throw("Passwords do not match");
    }

    const salt = await bcrypt.genSalt(10);
    student.passwd = await bcrypt.hash(new_passwd, salt);

    student.reset_token = "";
    student.reset_token_expires = "";

    await student.save();

    return student;

}

module.exports = { createJWT, requireAuth, checkUser, reset_passwd, forgot_passwd }