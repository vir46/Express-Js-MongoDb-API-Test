var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
var port = process.env.PORT || 3000;


// Setting Database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/apiusers');

var User = require('./models/users');

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware Configuration
router.use(function(req, res, next) {
    console.log('Log printed at : ', Date.now());
    next();
});

// test router
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});


// Route for users
router.route('/users')
    .post(function(req, res) {
        var user = new User();
        user.name = req.body.name;
        user.password = req.body.password;
        user.save(function(err) {
            if (err) res.send(err);
            res.json({ message: 'User created!' });
        });
    })

    .get(function(req, res) {
        User.find(function(err, users) {
            if (err) res.send(err);
            res.json(users);
        });
    });

router.route('/users/:name')
    .get(function(req, res) {
        User.find({ name: req.params.name }, function(err, user) {
            if (err) res.send(err);
            res.json(user);
        });
    })

    .put(function(req, res) {
        User.findOne({ name: req.params.name }, function(err, user) {
            if (err) res.send(err);
            user.password = req.body.password;
            user.save(function(err) {
                if (err) res.send(err);
                res.json({ message: 'User updated!' });
            });
        })
    })

    .delete(function(req, res) {
        User.remove({ name: req.params.name }, function(err, user) {
            if (err) res.send(err);
            res.json({ message: 'User deleted!' });
        });
    });

// Prefix api
app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);