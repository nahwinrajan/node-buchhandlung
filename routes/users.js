var express         = require('express'),
    router          = express.Router(),
    passport        = require("passport"),
    asyncjs         = require('async'),
    sgHelper= require('sendgrid').mail,
    crypto          = require("crypto");  //this is part of node.js, no installation needed


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

router.get('/forgot', (req, res) => {
  let email = (req.user) ? req.user.email : null;
  res.render('users/forgot', { csrf: req.csrfToken(), email });
});

router.post('/forgot', (req, res, next) => {
  //
  if (req.user) {
    if (req.user.email !== req.body.email) {
      req.flash("error", "You can only reset password for your account")
      return res.redirect("/users/forgot");
    }
  }

  asyncjs.waterfall([
    function generateToken(done) {
      crypto.randomBytes(20, (err, buf) => {
        let token = buf.toString('hex');
        done(err, token);
      });
    },
    function associateUserWithToken(token, done) {
      User.findByEmail(req.body.email, (err, user) => {
        if (!user) {
          req.flash("error", "No account registered with that email");
          res.redirect("/users/forgot");
        } else {
          user.resetPasswordToken = token,
          user.resetPasswordExpiry = Date.now() + 3600000; // 1 hour from now

          user.save(err => {
            console.log("token associated with user");
            done(err, token, user);
          });
        }
      });
    },
    function sendResetEmail(token, user, done) {
      let mail = new sgHelper.Mail(
        new sgHelper.Email("Buchhandlung-Bot<noreply@buchhandlung.com>"),
        "Buchhandlung - Password Reset Request",
        new sgHelper.Email(user.email),
        new sgHelper.Content("text/plain", `
          You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
           http://${req.headers.host}/users/reset/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged\n
        `)
      );

      let sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
      let request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
      })

      sg.API(request, (err, res) => {
        if (!err) req.flash("success", "An e-mail has been sent to " + user.email + " with further instructions.")
        done(err, "done");
      });
    }
  ], function (err) {
    if (err) return next(err);
    res.redirect('/users/forgot');
  });
});

router.get("/reset/:token", (req, res) => {
  User.findByResetToken(req.params.token, (err, user) => {
    if (err) {
      console.log(err);
      req.flash("error", "unexpected error encountered");
      return res.redirect("/users/forgot");
    }

    if (!user) {
      req.flash("error", "Reset token is invalid or has expired");
      return res.redirect("/users/forgot");
    }

    res.render("users/reset", {
      token: req.params.token,
      email: user.email,
      csrf: req.csrfToken()
    });
  });
});

router.put('/reset/:token', (req, res) => {
  asyncjs.waterfall([
    function findAndUpdate(done) {
      User.findByResetToken(req.params.token, (err, user) => {
        if (!user) {
          req.flash("error", "Reset token is invalid or has expired");
          done(new Error("Reset token is invalid or has expired"));
        }

        user.password = User.encryptPassword(req.body.password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;

        user.save( err => {
          if (err) {
            req.flash("error", "Failed to update password");
            done(new Error("failed to update user document"));
          } else {
            req.logIn(user, err => {
              req.flash("success", "Your password has been changed!");
              done(null, user); // I don't care for error on automatic login at this time
            });
          }
        });
      });
    },
    function sendNotifPasswordChanged(user, done) {
      let mail = new sgHelper.Mail(
        new sgHelper.Email("Buchhandlung-Bot<noreply@buchhandlung.com>"),
        "Buchhandlung - Password Changed",
        new sgHelper.Email(user.email),
        new sgHelper.Content("text/plain",
          `This is a confirmation that the password for your account ${user.email} has just been changed.\n`
        )
      );

      let sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
      let request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
      })

      sg.API(request, (err, res) => { done(err, "done"); });
    }
  ], err => {
    if (err) {
      console.log(err);
      res.redirect("/users/forgot");
    } else {
      res.redirect("/");
    }
  });
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

// show profile
router.get('/profile', middlewareObj.isLoggedIn, (req, res) => {
  res.render("users/profile", { profile: req.user });
});

// show edit form
router.get('/profile/edit', middlewareObj.isLoggedIn, (req, res) => {
  res.render("users/edit", { csrf: req.csrfToken() });
});

// update
router.put('/profile', middlewareObj.isLoggedIn, (req, res) => {
  let name = req.body.name;

  User.findByIdAndUpdate(
    {
      _id: req.user._id
    },
    {
      $set: { name }
    },
    (err, cb) => {
      if (err) {
        console.log(err);
        req.flash("error", "failed to update profile");
        res.redirect("/users/profile/edit");
      } else {
        req.flash("success", "profile updated");
        res.redirect("profile");
      }
    }
  );
});



module.exports = router;
