//const Student = require('../models/student.auth.model'); // Actual model
const Student = require('../testing/student.auth.model'); // Testing model

const bcrypt = require('bcrypt');

const { sendVerificationMail, verifyEmail } = require('../middleware/verification.middleware');
const { createJWT, forgot_passwd, reset_passwd  } = require('../middleware/auth.middleware');

module.exports.login_get = (req, res) => {
    if (req.cookies.jwt) {
        res.redirect('/');
    }
    res.render('login');
};

module.exports.signup_get = (req, res) => {
    if (req.cookies.jwt) {
        res.redirect('/');
    }
    res.render('signup');
};

module.exports.signup_post = async (req, res) => {
    const { username, email, passwd, first_name, last_name, confirm_passwd } = req.body;
    
    try {

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
        
        await newUser.save();
        
        // send verification mail
        await sendVerificationMail(req, email, newUser.confirmation_token);

        res.send({"response":"Registration successful"});

    } catch (err) {
        res.status(400).json(err);
    }

}

module.exports.login_post = async (req, res) => {
    const { email, passwd } = req.body;

    try {

        // pgsql code :
        
        // const student = await Student.findOne({ where: { email: email } });
        const student = await Student.findOne({ email: email });
        if (student) {
            if (student.email_verified == false) {
                return res.status(400).send("Email not verified");
            }
            const auth = await bcrypt.compare(passwd, student.passwd);
            if (auth) {
                const duration = 7 * 24 * 60 * 60;
                const token = createJWT(student.id, duration);
                res.cookie('jwt', token, { httpOnly: true, maxAge: duration * 1000 });
                res.status(200).json({ student: student.id });
            } else {
                res.status(400).send("Incorrect password");
            }
        } else {
            res.status(400).send("Incorrect email");
        }

        // mongodb code :
        // const student = await Student.login(email, passwd);
        // const duration = 7 * 24 * 60 * 60;
        // const token = createJWT(student._id, duration);
        // res.cookie('jwt', token, { httpOnly: true, maxAge: duration * 1000 });
        // res.status(200).json({ student: student._id });

    } catch (err) {
        console.log(err);
        res.status(400).send({err:err.message});
    }

}

// Mail verification route
module.exports.verify_get = async (req, res) => {
    try {
        const token = req.query.id;
        // const verified = await Student.verify(token);

        const verified = await verifyEmail(token);

        if (verified) {
            res.setHeader('Content-type','text/html');
            res.send("Email verified <a href='/login'>Login</a>");
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
    } catch {
        res.status(400).send("Error");
    }
}

module.exports.forgot_get = (req, res) => {
    res.render('forgot');
}

module.exports.forgot_post = async (req, res) => {
    try {
        const mail = req.body.email;
        // const student = await Student.findOne({where : {email : mail}});
        const student = await Student.findOne({email : mail});

        if (!student) {
            res.status(400).send("Email not found");
        }
        forgot_passwd(req,student);
        res.send("Email sent");
    } catch {
        res.status(400).send("Error");
    }
}

module.exports.reset_get = async(req, res) => {
    
    try {
        
        const token = req.query.id;

        if(!token) {
            return res.status(400).send("Invalid token - None provided");
        }

        // const student = Student.findOne({where : {reset_token : token}});
        const student = await Student.findOne({reset_token : token});
        
        if (!student) {
            return res.status(400).send("Invalid token - Not found");
        }

        const expiry = student.reset_token_expires;

        if (Date.now() > expiry) {
            return res.status(400).send("Token expired");
        }

        res.locals.user = student;
        
        res.render('reset');

    } catch {
        res.status(400).send("Error");
    }
}

module.exports.reset_post = async (req, res) => {
    
    try {
        const old_passwd = req.body.old_passwd;
        const new_passwd = req.body.new_passwd;
        const confirm_passwd = req.body.confirm_passwd;
        const username = req.body.username;
        const token = req.body.token;

        const resetStatus = await reset_passwd(username,token,old_passwd,new_passwd,confirm_passwd)
        
        if (resetStatus) {
            res.send("Password changed");
        } else {
            res.status(400).send("Error");
        }

    } catch(err) {
        res.status(400).send(err);
    }  
}