const express = require('express');
const router = express.Router();
const slugify = require('slugify');
const Category = require('../database/models/Category');
const utils = require('../public/js/utils');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/categories/new', adminAuth, (req, res) => {
    res.render('admin/categories/newCategory');
});

router.post('/admin/categories/save', adminAuth, (req, res) => {
    let title = req.body.title;

    if (title != undefined) {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then((result) => {
            res.redirect('/admin/categories');
        }).catch((err) => {
            console.log(err);
        });
    } else {
        res.redirect('/admin/categories/new');
    }
});

router.get('/admin/categories', adminAuth, (req, res) => {
    Category.findAll().then((categories) => {
        res.render('admin/categories/indexCategories', { categories: categories });
    }).catch((err) => {
        console.log(err);
    });

});

router.post('/admin/categories/delete', adminAuth, (req, res) => {
    let id = req.body.id;
    if (utils.isValidId(id)) {
            Category.destroy({
                where: {
                    id: id
                }
            }).then((result) => {
                res.redirect('/admin/categories');
            }).catch((err) => {
                console.log(err);
                res.redirect('/admin/categories');
            });
    } else {
        res.redirect('/admin/categories');
    }
});

router.get('/admin/categories/edit/:id', adminAuth, (req, res) => {
    let id = req.params.id;
    Category.findByPk(id).then((category) => {
        if (category != undefined) {
            res.render('admin/categories/editCategory', { category: category });
        } else {
            res.redirect('/admin/categories');
        }
    }).catch((err) => {
        console.log(err);
        res.redirect('/admin/categories');
    });
});

router.post('/admin/categories/edit', adminAuth, (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    if (utils.isValidId(id)) {
            Category.update({ title: title, slug: slugify(title) }, {
                where: { id: id }
            }).then((result) => {
                res.redirect('/admin/categories');
            }).catch((err) => {
                console.log(err);
                res.redirect('/admin/categories');
            });
    }
});

module.exports = router;