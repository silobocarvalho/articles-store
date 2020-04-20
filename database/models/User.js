const Sequelize = require('sequelize');
const connection = require('../dbConnection');

const User = connection.define('users', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

/*
//Used to create the table in database.
User.sync({
    force: true
});
*/

module.exports = User;