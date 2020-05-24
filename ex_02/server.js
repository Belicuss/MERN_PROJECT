const express = require('express')
const app = express()
app.set('view engine', 'ejs')
var bodyParser = require("body-parser");
var sha1 = require('sha1');
/* var JSAlert = require("js-alert"); */
const mongoose = require('mongoose');
var session = require('express-session')
mongoose.connect('mongodb://localhost:27042/mern-pool', { useUnifiedTopology: false }, function (err, dob) {

    if (err) {
        console.log('Connection failed.');
        throw err;
    } else {

        console.log('Connection successfull.');
    }
    var db = mongoose.connection;

    app.use(session({
        secret: 'ssshhhhh',
        cookie: {
            maxAge: 6000000000,// 1 week
            secure: false,
        },
        // * https://www.npmjs.com/package/express-session#resave
        // * https://www.npmjs.com/package/express-session#saveuninitialized
        resave: true,
        saveUninitialized: true
    }));


    /*______________________________________________________*/

    app.get('/register', function (req, res) {
        res.render('pages/register')
    })
    app.get('/welcome', function (req, res) {
        res.render('pages/welcome')
    })

    app.use(bodyParser.json());
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.post('/sign_up', function (req, res) {
        let id = db.collection('register').find().Count() + 1;
        var login = req.body.login;
        var email = req.body.email;
        var password = req.body.password;
        var passwordConfirm = req.body.passwordConfirm;
        var admin = "false";
        if (password !== passwordConfirm) {
            console.log('Password KO');
        }
        var password = sha1(password);

        var data = {
            "login": login,
            "email": email,
            "password": password,
            "passwordConfirm": passwordConfirm,
            "admin": admin,
        }
        db.collection('register').insertOne(data, function (err, collection) {
            if (err) {
                console.log(" Failed to save the collection.");
                return res.status(400).send(err);
            }
            else {
                console.log("Collection saved !");
            }
        });
        return res.render('pages/login');
    })

    app.get('/login', function (req, res) {
        res.render('pages/login')
    })


    app.post('/login_up', function (req, res) {
        sess = req.session;
        var email = req.body.email;
        var password = sha1(req.body.password);
        sess.email = req.body.email;

        db.collection('register').findOne({ email: email, password: password }, function (err, data) {
            if (err) {
                console.log(err);
                return res.status(504).send(err);
            }
            if (!data) {
                return res.status(400).send(err);
            }

            console.log(data);
            
            return res.render('pages/welcome', { data: data });
        })
    })
    
    app.get('/boutique', function (req, res){
    db.collection('boutique').find({}).toArray(function (err, boutique, ){
        if (err) {
            console.log(err);
        }
        if(!boutique){
            console.log('0 articles found');
        }
        console.log(boutique);
        
        return res.render('pages/boutique', { boutique: boutique }); 
        
    });
});
app.get('/boutique/:id', function(req, res) {
    console.log(req.params.id)
    
    db.collection('boutique').findOne({id_product: parseInt(req.params.id)} ,function (err, produit) {
        if (err) {
            res.send("Ce produit n'existe pas");
        } else {
            console.log(produit)
            
            res.render('pages/articles', {produit: produit});
        }
    })
})
    app.listen(4242);
});


  
    /*     app.get('/logout', function (req, res) {
    
            req.session.destroy(function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.redirect('/pages/login');
                }
            });
        }); */
