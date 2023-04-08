require("dotenv").config();
// const Student = require("../models/student.auth.model");    // Actual model
const Student = require("../mongo.models/student.model");  // Testing model
const { sendMail } = require("../middleware/mailing.middleware");

async function sendVerificationMail(email, host, token) {

    try {

        let sender = `Bhidu Verification <${process.env.mail}>`;
        let subject = "Verify your email";
        let link = `https://${host}/verify?id=${token}`;
        let content = `Click <a href="${link}">here</a> to verify your email`;

        const mail = await sendMail(email, sender, subject, content);
        
        console.log(mail);

    } catch (error) {
        console.log(error);
        throw error;
    }
    
}

async function verifyEmail(token) {
    // const student = await Student.findOne({where : { confirmation_token: token }}); // sequelize
    const student = await Student.findOne({ confirmation_token: token }); // mongoose

    if (student) {

        student.email_verified = true;
        student.confirmation_token = '';

        await student.save();

        return student;
    }
    throw Error('incorrect token');
}

module.exports = { sendVerificationMail, verifyEmail };
