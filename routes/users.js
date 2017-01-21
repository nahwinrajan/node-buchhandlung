var express         = require('express'),
    router          = express.Router(),
    passport        = require("passport");


// variables - model
var User = require('./../models/user');

// show register form
router.get('/signup', function(req, res) {
  res.render("users/signup", { csrf: req.csrfToken() });
});

// create
router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/users/signup',
    failureFlash: true
  }), function(req, res, next) {
    // if we pass the authenticate middleware process for signup
    // passport will automatically signin the new user
    var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
    delete req.session.redirectTo;

    res.redirect(redirectTo);
  }
);

// show edit form

// update

// delete

// show sign in form
router.get('/signin', function(req, res) {
  res.render("users/signin", { csrf: req.csrfToken() });
});

// sign in
router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/users/signin',
    failureFlash: true
  }), function(req, res, next){

    var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
    delete req.session.redirectTo;

    res.redirect(redirectTo);
});

// sign out
router.get('/signout', function (req, res) {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
