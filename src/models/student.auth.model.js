const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.connect.js');
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
                min: {
                    args:[8],
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
        confirmation_token: {
            type: DataTypes.STRING,
        },
        reset_token: {
            type: DataTypes.STRING,
        },
        email_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        reset_token: {
            type: DataTypes.STRING,
        },
        reset_token_expires: {
            type: DataTypes.DATE,
        },

    },{
        timestamps: false
    });
    
    Student.beforeCreate(async (student, options) => {
        function randomString(length) {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
            return result;
        }

        student.confirmation_token = randomString(15);
    });

    // Student.addHook('afterSave', async (student, options) => {
    //     console.log("Student added");
    //     next();
    // });

    module.exports = Student;
} catch (err) {
    console.log(err);
}

