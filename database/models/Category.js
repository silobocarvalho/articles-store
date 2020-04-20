const Sequelize = require('sequelize');
const connection = require('../dbConnection');

const Category = connection.define('categories', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

/*
//Used to create the table in database.
Category.sync({
    force: true
});
*/

module.exports = Category;