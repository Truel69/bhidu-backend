const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.connect.js');
const bcrypt = require('bcrypt');
const { sendVerificationMail } = require('../middleware/mailVerif');
// const validator = require('validator');

/*
id INT,
	first_name VARCHAR(50),
	last_name VARCHAR(50),
	email VARCHAR(50),
	gender VARCHAR(50),
	dob DATE,
	passwd VARCHAR(50),
	username VARCHAR(50),
	address VARCHAR(50),
	bio TEXT,
	college VARCHAR(12)
    */
try {
    const Student = sequelize.define('students', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: "Username already in use"},
            validate:{
                len: {
                    args:[4, 12],
                    msg: "Username must be between 4 and 12 characters"
                },
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: "Email already in use"},
            validate:{
                isEmail: {
                    args: true,
                    msg: "Please enter a valid email address"
                },
            }
        },
        passwd: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                len: {
                    args:[8, 30],
                    msg: "Password must be between 8 and 30 characters"
                },
            }
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
        dob: {
            type: DataTypes.DATE,
        },
        bio: {
            type: DataTypes.TEXT,
        },
        college: {
            type: DataTypes.STRING,
        },

        confirmation_token: {
            type: DataTypes.STRING,
        },
        email_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    },{
        timestamps: false
    });
    
    Student.beforeCreate(async (student, options) => {
        const salt = await bcrypt.genSalt(10);
        student.passwd = await bcrypt.hash(student.passwd, salt);
        // generate random string token for email verification link
        student.confirmation_token = await bcrypt.genSalt(5);
        // send verification mail
        await sendVerificationMail(student.email, student.confirmation_token);
    });

    // Student.addHook('afterSave', async (student, options) => {
    //     console.log("Student added");
    //     next();
    // });

    module.exports = Student;
} catch (err) {
    console.log(err);
}

