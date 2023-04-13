//const Student = require('../models/student.auth.model'); // Actual model
const Student = require('../mongo.models/student.model'); // Testing model

const bcrypt = require('bcrypt');

const { createJWT } = require('../middleware/auth.middleware');
const { forgot_passwd, reset_passwd } = require('../middleware/pass.reset.middleware');
const { sendVerificationMail, verifyEmail } = require('../middleware/verification.middleware');
const { randomString } = require('../middleware/token.gen.middleware');

module.exports.signup_post = async (req, res) => {
    
    try {
        const { username, email, passwd, first_name, last_name, confirm_passwd } = req.body;

        if (passwd != confirm_passwd) {
            return res.status(400).send("Passwords do not match");
        }

        const newUser = await Student.create({
            username,
            first_name,
            last_name,
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

    } catch (err) {
        console.log(err)
        res.status(400).send({err:err.message});
    }

}

module.exports.login_post = async (req, res) => {
    
    try {
        const { email, passwd } = req.body;
        
        const student = await Student.findOne({ email: email });
        if (student) {

            // Email is verified
            if (student.email_verified == false) {
                return res.status(400).send("Email not verified");
            }

            // Passwd check
            const auth = await bcrypt.compare(passwd, student.passwd);
            if (auth) {
                // gnerate jwt cookie
                const duration = 7 * 24 * 60 * 60;
                const token = createJWT(student.id, duration);
                res.cookie('jwt', token, { httpOnly: true, maxAge: duration * 1000 });
                res.status(200).json({ token });
            } else {
                res.status(400).send("Incorrect password");
            }
        } else {
            res.status(400).send("Incorrect email");
        }

    } catch (err) {
        console.log(err);
        res.status(400).send({err:err.message});
    }

}

// Mail verification route
module.exports.verify_get = async (req, res) => {
    try {
        const token = req.query.id;

        if (!token) {
            return res.status(400).send("Invalid token - None provided");
        }

        const verified = await verifyEmail('student',token);

        if (verified) {
            res.send("Email verified");
        } else {
            res.send("Invalid token");
        }
    } catch (err) {
        console.log(err);
        res.status(400).send({err:err.message});
    }
}

module.exports.logout_get = (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 1 });
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(400).send({err:err.message});
    }
}

module.exports.forgot_post = async (req, res) => {
    try {
        const mail = req.body.email;
        // const student = await Student.findOne({where : {email : mail}});
        const student = await Student.findOne({email : mail});

        if (!student) {
            res.status(400).send("Email not found");
        }
        const host = req.get('host');

        await forgot_passwd(host,student);
        res.send("Password reset link sent to email");
    } catch (err) {
        console.log(err);
        res.status(400).send({err:err.message});
    }
}

// configures the reset page according to the token passed in the url and gives access accordingly to the user
// module.exports.reset_get = async(req, res) => {
    
//     try {
        
//         const token = req.query.id;

//         if(!token) {
//             return res.status(400).send("Invalid token - None provided");
//         }

//         // const student = Student.findOne({where : {reset_token : token}});
//         const student = await Student.findOne({reset_token : token});
        
//         if (!student) {
//             return res.status(400).send("Invalid token - Not found");
//         }

//         const expiry = student.reset_token_expires;

//         if (Date.now() > expiry) {
//             return res.status(400).send("Token expired");
//         }

//         res.locals.user = student;
        
//         res.render('reset');

//     } catch {
//         res.status(400).send("Error");
//     }
// }

module.exports.reset_post = async (req, res) => {
    
    try {
        const new_passwd = req.body.new_passwd;
        const confirm_passwd = req.body.confirm_passwd;
        const username = req.body.username;
        const token = req.body.token;

        let forgot = {
            bool: true,
            token: token
        }

        const resetStatus = await reset_passwd('student',username,forgot,new_passwd,confirm_passwd);
        
        if (resetStatus) {
            res.send("Password changed");
        } else {
            res.status(400).send("Error");
        }

    } catch(err) {
        console.log(err);
        res.status(400).send({err:err.message});
    }  
}

module.exports.change_passwd_post = async (req, res) => {
    try {
        const old_passwd = req.body.old_passwd;
        const new_passwd = req.body.new_passwd;
        const confirm_passwd = req.body.confirm_passwd;
        const username = req.body.username;
        let forgot = {
            bool: false,
            old_passwd: old_passwd,
        }

        const resetStatus = await reset_passwd('student',username,forgot,new_passwd,confirm_passwd);
        
        if (resetStatus) {
            res.send("Password changed");
        } else {
            res.status(400).send("Error");
        }

    } catch(err) {
        console.log(err);
        res.status(400).send(err);
    }
}