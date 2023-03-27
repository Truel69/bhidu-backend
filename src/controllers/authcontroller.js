const bcrypt = require('bcrypt');
const Student = require('../models/student');
const jwt = require('jsonwebtoken');
const { verifyEmail } = require('../middleware/mailVerif');

const btmatdeyaar = (err) => {
    // Collects all validation errors and sends a list of them as response
    
    let errorResponse = {};
    
    if (err.errors) {
        Object.values(err.errors).forEach(err => {
            errorResponse[err.path] = err.message;
        });
    } else {
        errorResponse = err;
    }

    return errorResponse;

}

const duration = 60 * 60 * 24 * 7; // 7 days

const createJWT = (id, duration) => {
    
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: duration });
}

// Get requests
// module.exports.signup_get = (req, res) => {
//     res.send("Signup page");
// }
  
// module.exports.login_get = (req, res) => {
//     res.send("Login page");
// }

module.exports.signup_post = async (req, res) => {
    const { username, email, passwd, first_name, last_name, confirm_passwd } = req.body;
    
    try {

        if (passwd !== confirm_passwd) {
            return res.status(400).send("Passwords do not match");
        }

        const newUser = await Student.create({
            username,
            first_name,
            last_name,
            email,
            passwd
        });
        
        await newUser.save()
        
        const token = createJWT(newUser.id, duration);

        res.cookie('jwt', token, { httpOnly: true, maxAge: duration * 1000 });
        
        res.send("Registration successful");

    } catch (err) {
        let errorResponse = btmatdeyaar(err);
        res.status(400).json(errorResponse);
    }

}

module.exports.login_post = async (req, res) => {
    const { email, passwd } = req.body;

    // check if username and/or email already in use
    try {
        
        const student = await Student.findOne({ where: { email: email } });
        if (student) {
            const auth = await bcrypt.compare(passwd, student.passwd);
            if (auth) {
                console.log('Authorized')
                const token = createJWT(student.id, duration);
                res.cookie('jwt', token, { httpOnly: true, maxAge: duration * 1000 });
                
                res.status(200).json({ student: student });
            } else {
                res.status(400).send("Incorrect password");
            }
        } else {
            res.status(400).send("Incorrect email");
        }



    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }

}


// Get routes for testing

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}


// Mail verification route
module.exports.verify_get = async (req, res) => {
    const token = req.params.token;
    console.log(token);
    const verified = await verifyEmail(token);
    if (verified) {
        res.send("Email verified");
    } else {
        res.send("Invalid token");
    }
}

