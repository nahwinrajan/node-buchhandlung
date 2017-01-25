var express         = require('express'),
    router          = express.Router(),
    passport        = require("passport");


// variables - model
var User    = require('./../models/user'),
    Order   = require('./../models/order');

// variables - middleware
var middlewareObj = require('./../middlewares');

// show register form
router.get('/signup', (req, res) => {
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

// show sign in form
router.get('/signin', (req, res) => {
  res.render("users/signin", { csrf: req.csrfToken() });
});

// sign in
router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/users/signin',
    failureFlash: true
  }), (req, res, next) => {

    var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
    delete req.session.redirectTo;

    res.redirect(redirectTo);
});

// sign out
router.get('/signout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

// order history / recent transaction
router.get('/transactions', middlewareObj.isLoggedIn, (req, res) => {
  Order.findByCustomer( req.user, function(err, data) {
    if(err) {
      console.log(err);
      req.flash("error", "something went wrong while trying to retrieve recent transaction");
      data = null;
    }

    res.render("users/transaction", { orders: data});
  });
});

// show edit form

// update

// delete


module.exports = router;
