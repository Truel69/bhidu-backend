
const mongoose = require("mongoose");
const { isEmail } = require('validator');

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
    email_verified: {
        type: Boolean,
        defaultValue: false
    },
    reset_token: {
        type: String,
    },
    reset_token_expires: {
        type: Date,
    },

});

// Student model

const Student = mongoose.model("Student", studentSchema);

// Export the model

module.exports = Student;

