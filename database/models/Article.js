const Sequelize = require('sequelize');
const connection = require('../dbConnection');
const Category = require('./Category');

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Article.belongsTo(Category, {foreignKey: {allowNull: false}});
Category.hasMany(Article, {foreignKey: {allowNull: false}}); 

/*
//Used to sybc the table in database, should be used after all procedures.
Article.sync({
    force: true
});
*/


module.exports = Article;