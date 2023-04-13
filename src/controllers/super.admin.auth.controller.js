const superAdmin = require('../mongo.models/super.admin.model');

const bcrypt = require('bcrypt');

const { createJWT  } = require('../middleware/auth.middleware');
const { forgot_passwd, reset_passwd } = require('../middleware/pass.reset.middleware');
const { sendVerificationMail, verifyEmail } = require('../middleware/verification.middleware');
const { randomString } = require('../middleware/token.gen.middleware');
const SuperAdmin = require('../mongo.models/super.admin.model');

module.exports.signup_post = async (req, res) => {
    try {
        const { username, email, full_name, passwd, confirm_passwd } = req.body;

        if (passwd != confirm_passwd) {
            return res.status(400).send("Passwords do not match");
        }

        const newUser = await superAdmin.create({
            username,
            full_name,
            email,
            passwd
        });

        const salt = await bcrypt.genSalt(10);
        newUser.passwd = await bcrypt.hash(passwd, salt);

        const token = await randomString(20);

        newUser.email_verified = false;
        newUser.confirmation_token = token;

        await newUser.save();

        const host = req.get('host');

        await sendVerificationMail(email,host,token);

        res.send({"response":"Registration successful"});


    } catch(err) {
        console.log(err);
        res.status(400).send({err:err.message});
    }

}

module.exports.login_post = async (req, res) => {

    try {
        const { email, passwd } = req.body;

        const superadmin = await superAdmin.findOne({ email: email });

        if (!superadmin) {
            return res.status(400).send("Email not registered");
        }

        // Email is verified

        if (!superadmin.email_verified) {
            console.log(superadmin.email_verified);
            return res.status(400).send("Email not verified");
        }

        // Passwd check

        const validPasswd = await bcrypt.compare(passwd, superadmin.passwd);

        if (!validPasswd) {
            return res.status(400).send("Invalid password");
        }

        // Create and assign a token
        const duration = 60 * 60 * 24 * 7; // 7 days
        const token = createJWT(superadmin._id, duration);

        res.cookie('jwt', token, { httpOnly: true, maxAge: duration * 1000 });
        res.status(200).json({ token });
    } catch(err) {
        console.log(err);
        res.status(400).send({err:err.message});
    }
}

module.exports.verify_get = async (req, res) => {

    try {
        const token = req.query.token;

        if(!token) {
            return res.status(400).send("Invalid token");
        }

        const verified = await verifyEmail('superadmin',token);

        if (verified) {
            res.send("Email verified");
        } else {
            res.status(400).send("Email not verified");
        }

    } catch(err) {
        console.log(err);
        res.status(400).send({err:err.message});

    }
}

module.exports.logout_get = async (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 1 });
        res.redirect('/');
    } catch(err) {
        console.log(err);
        res.status(400).send({err:err.message});
    }
}

module.exports.forgot_post = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await SuperAdmin.findOne({ email: email });

        if(!user) {
            return res.status(400).send("Email not registered");
        }

        const host = req.get('host');

        await forgot_passwd(host,user);

        res.send("Email sent");

    } catch(err) {
        console.log(err);
        res.status(400).send({err:err.message});
    }
}

module.exports.reset_post = async (req, res) => {
    try {
        const { username, new_passwd, confirm_passwd, token } = req.body;

        if (new_passwd != confirm_passwd) {
            return res.status(400).send("Passwords do not match");
        }

        let forgot = {
            bool:true,
            token:token
        }

        const reset = await reset_passwd('superadmin',username,forgot,new_passwd,confirm_passwd);

        if (reset) {
            res.send("Password reset successful");
        } else {
            res.status(400).send("Password reset failed");
        }

    } catch(err) {
        console.log(err);
        res.status(400).send({err:err.message});
    }
}

module.exports.change_passwd_post = async (req, res) => {
    try {
        const { old_passwd, new_passwd, confirm_passwd, username } = req.body;

        let forgot = {
            bool:false,
            old_passwd:old_passwd
        }

        const resetStatus = await reset_passwd('superadmin',username,forgot,new_passwd,confirm_passwd);

        if (resetStatus) {
            res.send("Password reset successful");
        } else {
            res.status(400).send("Password reset failed");
        }

    } catch(err) {
        console.log(err);
        res.status(400).send({err:err.message});
    }
}