const { DataTypes } = require('sequelize');
const sequelize = require('../database');
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
            unique: true,
            validate:{
                len: [3, 12]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate:{
                isEmail: true
            }
        },
        passwd: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                len: [8, 30]
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
        }

    },{
        timestamps: false
    });
    
    module.exports = Student;
} catch (err) {
    console.log(err);
}

