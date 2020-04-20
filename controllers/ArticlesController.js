const express = require('express');
const router = express.Router();
const Category = require('../database/models/Category');
const Article = require('../database/models/Article');
const slugify = require('slugify');
const utils = require('../public/js/utils');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/articles', adminAuth, (req, res) => {
    Article.findAll({
        include: [{
            model: Category
        }]
    }).then((articles) => {
        console.log(articles)
        res.render('admin/articles/indexArticles', { articles: articles });
    }).catch((err) => {
        console.log(err);
        res.redirect('/admin/articles');
    });

});

router.get('/admin/articles/new', adminAuth, (req, res) => {
    Category.findAll().then((categories) => {
        res.render('admin/articles/newArticle', { categories: categories });
    }).catch((err) => {
        console.log(err);
        res.redirect('/admin/articles');
    });

});

router.post('/admin/articles/save', adminAuth, (req, res) => {
    let title = req.body.title;
    let content = req.body.content;
    let categoryId = req.body.categoryid;
    Article.create({
        title: title,
        slug: slugify(title),
        content: content,
        categoryId: categoryId
    }).then((result) => {
        res.redirect('/admin/articles');
    }).catch((err) => {
        console.log(err);
    });
});

router.post('/admin/articles/delete', adminAuth, (req, res) => {
    let id = req.body.id;
    if (utils.isValidId(id)) {
        Article.destroy({
            where: {
                id: id
            }
        }).then((result) => {
            res.redirect('/admin/articles');
        }).catch((err) => {
            console.log(err);
            res.redirect('/admin/articles');
        });
    } else {
        res.redirect('/admin/articles');
    }
});

router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
    let id = req.params.id;

    Article.findOne({
        where: { id: id },
        include: [{
            model: Category
        }]
    }).then((article) => {
        if (article != undefined) {
            Category.findAll().then((categories) => {
                res.render('admin/articles/editArticle', { article: article, categories: categories });
            }).catch((err) => {
                console.log(err);
                res.redirect('/admin/articles');
            });
        } else {
            res.redirect('/admin/articles');
        }
    }).catch((err) => {
        console.log(err);
        res.redirect('/admin/articles');
    });
});

router.post('/admin/articles/edit', adminAuth, (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    let content = req.body.content;
    let categoryId = req.body.categoryid;

    if (utils.isValidId(id)) {
        Article.update({ title: title, slug: slugify(title), content: content, categoryId: categoryId }, {
            where: { id: id }
        }).then((result) => {
            res.redirect('/admin/articles');
        }).catch((err) => {
            console.log(err);
            res.redirect('/admin/article');
        });
    }
});

router.get('/admin/articles/:id', adminAuth, (req, res) => {
    let id = req.params.id;

    if (utils.isValidId(id)) {
        Article.findOne({
            where: { id: id },
            include: [{
                model: Category
            }]
        }).then((article) => {
            res.render('admin/articles/detailArticle', { article: article });
        }).catch((err) => {
            console.log(err);
            res.redirect('/admin/articles');
        });
    }
});

router.get('/articles/json', (req, res) => {
    Article.findAndCountAll({

    }).then((articles) => {
        res.json(articles);
    }).catch((err) => {
        console.log(err);
        res.redirect('/');
    });
});

module.exports = router;

