require('dotenv').config();require('dotenv').config();
const { Sequelize } = require('sequelize');

const { PGHOST, PGUSER, PGPASSWORD, PGDATABASE, ENDPOINT_ID } = process.env;
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${ENDPOINT_ID}.${PGHOST}/${PGDATABASE}`;

const sequelize = new Sequelize(URL,
    {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    });

sequelize.sync(
    { alter: true } //<- this will alter the table and recreate it , { force: true } //<- this will drop the table if it already exists!
    );

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = sequelize;