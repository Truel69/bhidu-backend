
const Student = require('../models/student');

const btmatdeyaar = (err) => {

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

module.exports.signup_get = (req, res) => {
    res.send("Signup page");
}
  
module.exports.login_get = (req, res) => {
    res.send("Login page");
}

module.exports.signup_post = async (req, res) => {
    const { username, email, passwd, first_name, last_name } = req.body;

    try {
        const newUser = await Student.create({
            username,
            first_name,
            last_name,
            email,
            passwd,
            id : await Student.count() + 1
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
    
    const user = await Student.findOne({ where: { email } })
        .catch(err => res.status(500).send({error:err}));
    
    if(!user) return res.status(400).send("Email not found");

    const auth = await bcrypt.compare(passwd, user.passwd)

    if (auth) {
        const token = createJWT(user.id, duration);
        res.cookie('jwt', token, { httpOnly: true, maxAge: duration * 1000 });
    } else {
        return res.status(400).send("Password incorrect");
    }

    res.send("Login successful");

}
