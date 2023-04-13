const bcrypt = require('bcrypt');

const { randomString } = require('../middleware/token.gen.middleware');
const { sendMail } = require('../middleware/mailing.middleware');

const Student = require('../mongo.models/student.model');
const Faculty = require('../mongo.models/faculty.model');
const superAdmin = require('../mongo.models/super.admin.model');

// Fucntion to cheeck the category of user and return the model object of that 

async function getUser(usertype,username) {

    if (usertype=="student") {
        const user = await Student.findOne({username : username});
        return user;
    } else if (usertype=="faculty") {
        const user = await Faculty.findOne({username : username});
        return user;
    } else if (usertype=="superadmin") {
        const user = await superAdmin.findOne({username : username});
        return user;
    } else {
        throw("Invalid user type");
    }

}

// Handle password forgot request
async function forgot_passwd(host,user){

    const token = await randomString(10);
    
    user.reset_token = token;
    user.reset_token_expires = Date.now() + 3600000; // 1 hour

    await user.save();

    let link = `https://${host}/reset?id=${token}`;
    let sender = `Bhidu Help <${process.env.mail}>`;
    let subject = "Password reset request";
    let content = `Click <a href="${link}">here</a> to reset your password`;

    const mail = await sendMail(user.email, sender, subject, content);

    return mail;

}

async function reset_passwd(usertype,username,forgot,new_passwd,confirm_passwd) {

    if(!username) {
        throw("Invalid user - none provided");
    }

    // const student = await Student.findOne({where : {reset_token : token}});
    
    const user = await getUser(usertype,username);

    if (!user) {
        throw("User does not exist");
    }

    if(!forgot.bool) {
        // If reset request is not from forgot password page then request will be from change password page -> verify old password
        const auth = await bcrypt.compare(forgot.old_passwd, user.passwd);
        if (!auth) {
            throw("Wrong password entered");
        }
    } else {
        // Reset request comes from forgot page -> verify token
        if (user.reset_token != forgot.token) {
            throw("Invalid token for user");
        }

        // check token expiry
        if (user.reset_token_expires < Date.now()) {
            throw("Token expired");
        }

        user.reset_token = "";
        user.reset_token_expires = "";
    }
    
    if (new_passwd != confirm_passwd) {
        throw("Passwords do not match");
    }

    const salt = await bcrypt.genSalt(10);
    user.passwd = await bcrypt.hash(new_passwd, salt);

    await user.save();

    return user;

}

module.exports = { forgot_passwd, reset_passwd};