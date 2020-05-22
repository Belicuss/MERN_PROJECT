const express = require('express')
const app = express()
app.set('view engine', 'ejs')
var bodyParser = require("body-parser");
var sha1 = require('sha1');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27042/mern-pool', { useUnifiedTopology: true }, function (err, dob) {

    if (err) {
        console.log('Connection failed.');
        throw err;
    } else {

        console.log('Connection successfull.');
    }
    var db = mongoose.connection;

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
        var email = req.body.email;
        var password = req.body.password;
        var password = sha1(password);

        db.collection('register').findOne({ email: email, password: password }, function (err, data) {
            if (err) {
                console.log(err);
                return res.status(504).send(err);
            }
            if (!user) {
                return res.status(400).send(err);
            }
            // res.status(200).send();
            return res.render('connected', { data: data });
            // return res.status(200).send();
        })

        return res.render('pages/welcome');
    })
    app.listen(4242)
});