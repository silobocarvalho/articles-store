const express = require('express');
const router = express.Router();
const User = require('../database/models/User');
const bcrypt = require('bcryptjs');
const utils = require('../public/js/utils');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/users', adminAuth, (req, res) => {
    User.findAll().then((users) => {
        res.render("admin/users/listUsers", { users: users });
    }).catch((err) => {
        console.log(err);
        res.redirect('/admin/users/');
    });

});

router.get('/admin/users/create', (req, res) => {
    res.render("admin/users/newUser");
});

router.post('/admin/users/save', (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ where: { email: email } }).then((user) => {
        if (user == undefined) {
            let salt = bcrypt.genSaltSync(10);
            let hashPassword = bcrypt.hashSync(password, salt);
            User.create({
                name: name,
                email: email,
                password: hashPassword
            }).then(() => {
                res.redirect('/admin/users/');
            }).catch((err) => {
                console.log(err);
                res.redirect('/admin/users/');
            });
        } else {
            res.redirect('/admin/users/create');
        }
    }).catch((err) => {
        console.log('erro: ' + err);
        res.redirect('/admin/users/create');
    });
});


router.post('/admin/users/delete', adminAuth, (req, res) => {
    let id = req.body.id;
    if (utils.isValidId(id)) {
        User.destroy({
            where: {
                id: id
            }
        }).then((result) => {
            res.redirect('/admin/users');
        }).catch((err) => {
            console.log(err);
            res.redirect('/admin/users');
        });
    } else {
        res.redirect('/admin/users');
    }
});

router.get('/login', (req, res) => {
    res.render('admin/users/login');
});

router.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    User.findOne({
        where: {email: email}
    }).then((user) => {
        if(user != undefined){
            let passwordValidation = bcrypt.compareSync(password, user.password);
            if(passwordValidation){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect('/admin/articles');
            }else{
                res.redirect('/login');            
            }
        }else{
            res.redirect('/login');            
        }
    }).catch((err) => {
        console.log(err);
        res.redirect('/login');        
    });
});

router.get('/mysession', (req, res) => {
    if(req.session.user == undefined){
        res.redirect('/login');
    }
    res.json(req.session.user);
});

router.get('/logout', (req, res) => {
    req.session.user = undefined;
    res.redirect('/login');
});

module.exports = router;
