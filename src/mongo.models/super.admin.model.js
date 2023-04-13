
const mongoose = require("mongoose");
const { isEmail } = require('validator');

const superAdminSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
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

const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);

// Export the model
module.exports = SuperAdmin;

