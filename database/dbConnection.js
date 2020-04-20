const Sequelize = require('sequelize');

const connection = new Sequelize('articles-store', 'root', '123456789', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;

