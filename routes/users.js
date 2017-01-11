var express         = require('express'),
    router          = express.Router(),
    passport        = require("passport"),
    csrf            = require('csurf'),
    csrfProtection  = csrf();


// variables - model
var User = require('./../models/user');
router.use(csrfProtection);

// show register form
router.get('/users/signup', function(req, res) {
  res.render("users/signup", { csrf: req.csrfToken() });
});

// create
router.post('/users/signup', passport.authenticate('local.signup', {
    failureRedirect: '/users/signup',
    failureFlash: true
  }), function(req, res, next) {
    // if we pass the authenticate middleware process for signup
    // passport will automatically signin the new user
    res.redirect('/books');
  }
);

// show edit form

// update

// delete

// show sign in form
router.get('/users/signin', function(req, res) {
  res.render("users/signin", { csrf: req.csrfToken() });
});

// sign in
router.post('/users/signin', passport.authenticate('local.signin', {
    failureRedirect: '/users/signin',
    failureFlash: true
  }), function(req, res, next){
    res.redirect('/books');
});

// sign out
router.get('/users/signout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
