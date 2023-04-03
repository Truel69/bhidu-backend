// Testing the user authentication on locally hosted mongo server
// Production:: npm u mongoose

require('dotenv').config();
const mongoose = require("mongoose");
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

// Student schema
// first_name , last_name, username, email, passwd, confirmation_token, verified

const studentSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    passwd: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters'],
    },
    confirmation_token: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false,
    },
});

studentSchema.pre('save', async function(next) {

    // trivial function to generate random string token for email verification link
    
    function randomString(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
              result += characters.charAt(Math.floor(Math.random() * charactersLength));
              }
        return result;
    }

    this.confirmation_token = randomString(15);


    next();
});


// Login static

studentSchema.statics.login = async function(email, passwd) {
    const user = await this.findOne({ email: email });
    if (user) {
        if (!user.verified) {
            throw Error('Please verify your email');
        }
        const auth = bcrypt.compareSync(passwd, user.passwd);
        if (!auth) {
            throw Error('incorrect password');
        }
        return user;
    }
    throw Error('incorrect email');
}

// Verify static

studentSchema.statics.verify = async function(token) {
    const user = await this.findOne({ confirmation_token: token });
    if (user) {
        user.verified = true;
        user.confirmation_token = null;
        await user.save();
        return user;
    }
    throw Error('incorrect token');
}

// Student model

const Student = mongoose.model("Student", studentSchema);

// Export the model

module.exports = Student;

