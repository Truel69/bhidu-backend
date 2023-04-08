
const nodemailer = require("nodemailer");

async function sendMail(email,sender,subject,content) {
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

        let info = await transporter.sendMail({
            from: '"Bhidu" <'+sender+'>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: content, // html body
        });

        if (info) {
            return `Sent mail for : ${subject}`;
        }

    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = { sendMail };