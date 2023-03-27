const nodemailer = require("nodemailer");
const Student = require("../models/student");

async function sendVerificationMail(email, token) {

    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: email, // list of receivers
        subject: "Bhidu E-mail Verification", // Subject line
        text: "Please confirm your account to access the app. ", // plain text body
        html: `Click the <a href='https://localhost:3000/verify/:${token}'>here</a> to verify account`, // html body
    });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
}

async function verifyEmail(token) {
    const student = await Student.findOne({ where: { confirmation_token: token } });
    if (!student) {
        return false;
    }
    student.email_verified = true;
    student.confirmation_token = null;
    await student.save();
    return true;
}

module.exports = { sendVerificationMail, verifyEmail };
