const Student = require('../models/student.auth.model');
// const Student = require('../testing/student.auth.model');
const bcrypt = require('bcrypt');
const { verifyEmail } = require('../middleware/verification.middleware');
const { createJWT, requireAuth, checkUser  } = require('../middleware/auth.middleware');

const {sendVerificationMail} = require('../middleware/verification.middleware');


module.exports.login_get = (req, res) => {
    res.render('login');
};

module.exports.signup_get = (req, res) => {
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
        
        const student = await Student.findOne({ where: { email: email } });
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
        console.log(token);
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
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}

module.exports.reset_get = (req, res) => {
    res.render('reset');
}

module.exports.reset_post = (req, res) => {
    const mail = req.body.email;
    const student = Student.findOne({where : {email : mail}});
    if (!student) {
        res.status(400).send("Email not found");
    }

}