require("dotenv").config();
// const Student = require("../models/student.auth.model");    // Actual model
const Student = require("../mongo.models/student.model");  // Testing model
const SuperAdmin = require("../mongo.models/super.admin.model");
const Faculty = require("../mongo.models/faculty.model");

const { sendMail } = require("../middleware/mailing.middleware");

async function getUser(usertype,token) {
    if (usertype=="student") {
        const user = await Student.findOne({confirmation_token : token});
        return user;
    } else if (usertype=="faculty") {
        const user = await Faculty.findOne({confirmation_token : token});
        return user;
    } else if (usertype=="superadmin") {
        const user = await SuperAdmin.findOne({confirmation_token : token});
        return user;
    } else {
        throw "Invalid user type";
    }
}


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

async function verifyEmail(usertype,token) {
    // const student = await Student.findOne({where : { confirmation_token: token }}); // sequelize
    
    const user = await getUser(usertype,token);

    if (!user) {
        throw "User does not exist";
    }

    user.email_verified = true;
    user.confirmation_token = null;

    await user.save();

    return "successfully verified";

}

module.exports = { sendVerificationMail, verifyEmail };
