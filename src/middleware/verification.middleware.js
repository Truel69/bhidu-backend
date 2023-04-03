require("dotenv").config();
const nodemailer = require("nodemailer");
const Student = require("../models/student.auth.model");    // Actual model
// const Student = require("../testing/student.auth.model");  // Testing model

async function sendVerificationMail(req, email, token) {

    try {
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
                user: acc.user, // generated ethereal user
                pass: acc.pass, // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }

        });
        
        // verification link
    
        let link = "http://"+req.get('host')+"/verify?id="+token;

        let info = await transporter.sendMail({
            from: '"Bhidu Verification" <verify.bhidu@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Bhidu E-mail Verification", // Subject line
            text: "Please confirm your account to access the app. ", // plain text body
            html: "Click <a href="+link+">here</a> to verify account", // html body
        });

    } catch (error) {
        console.log(error);
        throw error;
    }
    
}

async function verifyEmail(token) {
    const student = await Student.findOne({ confirmation_token: token });
    if (student) {
        student.email_verified = true;
        student.confirmation_token = '';
        await student.save();
        return student;
    }
    throw Error('incorrect token');
}

module.exports = { sendVerificationMail, verifyEmail };
