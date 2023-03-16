const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Student = sequelize.define('students', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    passwd: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    timestamps: false
});



module.exports = Student;