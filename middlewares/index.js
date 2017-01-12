var middlewareObj = {};

// variables - models
var Book    = require("./../models/book");

middlewareObj.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }

  req.session.redirectTo = req.originalUrl;
  req.flash("error", "You must be <strong><em>signed-in</em></strong> to do that");
  res.redirect("/users/signin");
}

module.exports = middlewareObj;
