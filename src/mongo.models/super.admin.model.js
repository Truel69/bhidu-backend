
require('dotenv').config();
const mongoose = require("mongoose");
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const superAdminSchema = new mongoose.Schema({
    id: {
        type: Number,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
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


superAdminSchema.pre('save', async function(next) {

    // Sequelize uses before create but mongoose uses pre save so everytime the document is saved it gets resetted to this so to avoid that we use this if statement
    if (!this.email_verified){

        this.email_verified = false;
        this.confirmation_token = randomString(15);
    }

    next();
});


const Student = mongoose.model("Student", studentAuthSchema);

// Export the model

module.exports = Student;

