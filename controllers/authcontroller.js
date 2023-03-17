
const Student = require('../models/student');



module.exports.signup_get = (req, res) => {
    res.send("Signup page");
}
  
module.exports.login_get = (req, res) => {
    res.send("Login page");
}

module.exports.signup_post = async (req, res) => {
    const { username, email, passwd, first_name, last_name } = req.body;

    const newUser = await Student.create({
        username,
        first_name,
        last_name,
        email,
        passwd,
    })
    // catch validation error and return
    

    await newUser.save()
        .catch(err => res.status(500).send({error:err.message}));

    res.send("Registration successful");
}

module.exports.login_post = async (req, res) => {
    const { email, passwd } = req.body;

    // check if username and/or email already in use
    
    const user = await Student.findOne({ where: { email } })
        .catch(err => res.status(500).send({error:err}));
    
    if(!user) return res.status(400).send("Email not found");

    if (user.passwd !== passwd) return res.status(400).send("Wrong password");

    res.send("Login successful");

}
