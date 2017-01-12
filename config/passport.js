var passport        = require('passport'),
    localStrategy   = require('passport-local').Strategy;

// variables - models
var User        = require('../models/user');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('local.signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true   // so we have access to request object
  }, function(req, email, password, done) {
    //  ---** form validation **---
    req.checkBody('name', 'Invalid name').notEmpty().isLength({min: 1});
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:6});

    let errors = req.validationErrors();
    if (errors) {
      let msg = [];
      errors.forEach(function(error) {
        message.push(err.msg);
      });
      done(null, false, req.flash("error", msg));
    }

    User.findOne({ 'email': email}, function(err, user) {
      if(err) {
        return done(err);
      }

      if(user) {
        req.flash("error", "Email already registered, please use forgot password to reset your password");
        return done(null, false);
      }

      let newUser = new User({
        name      : req.body.name,
        email     : email
      });
      newUser.password  = newUser.encryptPassword(password);
      newUser.save(function(err, createdUser) {
        if(err) {
          return done(err);
        }

        console.log('User created: ' + createdUser.email);
        return done(null, createdUser);
      });
    });
  }
));

passport.use('local.signin', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done) {
    //  ---** form validation **---
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();

    let errors = req.validationErrors();
    if (errors) {
      let msg = [];
      errors.forEach(function(error) {
        message.push(err.msg);
      });
      done(null, false, req.flash("error", msg));
    }

    User.findOne({ 'email': email}, function(err, user) {
      if(err) {
        return done(err);
      }

      // avoid giving away user's email to hijackers
      if(!user) {
        req.flash("error", "Invalid username or password");
        return done();
      }

      if(!user.comparePassword(password)) {
        return done(null, false, {message: "Invalid username or password"});
      }

      return done(null, user);
    });
  }
));
