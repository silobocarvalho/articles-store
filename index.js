const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

//Database configuration - BEGIN
const connectionDb = require('./database/dbConnection');
connectionDb.authenticate().then((result) => {
    console.log('Database configuration: authenticate() - ok.');
}).catch((err) => {
    console.log('Database configuration error: ' + err);
});
//Database configuration - END

//Controllers - BEGIN
const categoriesController = require('./controllers/CategoriesController');
const articlesController = require('./controllers/ArticlesController');
const usersController = require('./controllers/UsersController');
//Controllers - END

//Database models - BEGIN
const Category = require('./database/models/Category');
const Article = require('./database/models/Article');
//Database models - END

//Libs configuration - BEGIN
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
//Libs configuration - END



//Variables definition - BEGIN
const serverPortNumber = process.env.PORT || 5555
//Variables definition - END

//Session - BEGIN
app.use(session({
    secret: 'agligidinaglirobiran',
    cookie: {
        maxAge: 30 * 60 * 1000 // 30 min * 60 seconds * 1000 ms
    }
}));
//Session - END

//Import routes - BEGIN
app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);
//Import routes - END



app.get('/', (req, res) => {
    Article.findAll({
        include: [{
            model: Category
        }]
    }).then((articles) => {
        res.render('users/index-users', { articles: articles });
    }).catch((err) => {
        console.log(err);
        res.redirect('/');
    });
});

app.get('/admin', (req, res) => {
    res.render('admin/index-admin');
});

app.get('/categories', (req, res) => {
    Category.findAll().then((categories) => {
        res.render('users/categories', { categories: categories });
    }).catch((err) => {
        console.log(err);
        res.redirect('/');
    });

});

app.get('/categories/:slug', (req, res) => {
    let slugCategory = req.params.slug;

    Category.findOne({
        where: { slug: slugCategory },
        include: [{
            model: Article
        }]
    }).then((category) => {
        if (category != undefined) {
            res.render('users/articlesPerCategory', { articles: category.articles });
        }
    }).catch((err) => {
        console.log(err);
        res.redirect('/');
    });

});


app.get('/:slug', (req, res) => {
    let slug = req.params.slug;

    Article.findOne({
        where: { slug: slug },
        include: [{
            model: Category
        }]
    }).then((article) => {
        if (article != undefined) {
            res.render('users/articleUsers', { article: article });
        } else {
            res.redirect('/');
        }
    }).catch((err) => {
        console.log(err);
        res.redirect('/');
    });

});




app.listen(serverPortNumber, () => {
    console.log("Server started at port: " + serverPortNumber);
});