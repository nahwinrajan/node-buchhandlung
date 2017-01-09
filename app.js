// variables - node modules
var express         = require('express'),
    app             = express(),
    mongoose        = require('mongoose'),
    path            = require('path'),
    morgan          = require('morgan'),
    methodOverride  = require('method-override'),
    expressSanitizer= require('express-sanitizer'),
    bodyParser      = require('body-parser'),
    cookieParser    = require('cookie-parser'),
    passport        = require('passport'),
    localStrategy   = require('passport-local').Strategy,
    expressSession  = require('express-session'),
    favicon         = require('serve-favicon'),
    flash           = require('connect-flash'),
    FileStreamRotator= require('file-stream-rotator'),
    fs              = require('fs'),
    seedDB          = require('./seeds');

// variables - models

// variables - routes
var   IndexRoutes           = require("./routes/index"),
      BookRoutes            = require("./routes/books");

// variables - others
var logDirectory = path.join(__dirname, 'logs');

// app configuration
app.set("view engine", "ejs");
app.use(morgan('dev'));
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, '/scss'),
  dest: path.join(__dirname, '/public'),
  // debug: true,
  prefix: '',
  force: true,
  outputStyle: 'compressed'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
app.use(expressSession({
  secret: "Dies ist das Geheimnis, das verwendet wird, um das Sitzungs-ID-Cookie zu signieren. Dies kann entweder ein String für ein einzelnes Geheimnis oder ein Array mit mehreren Geheimnissen sein",
  resave: false,               //don't kept saving session on server
  saveUninitialized: false    //do not save session that has nothing in it
}));
app.use(flash());

// db - configuration
mongoose.connect("mongodb://localhost/buchhandlung");
// seedDB();

// passport - authentication
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// log - configuration
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);  // ensure log directory exists
// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMMDD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false
});
// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))

//set up local variable
app.use(function(req, res, next) {
  // req.user is property set by passport
  // req.locals.variableName => this how we set local variable on view for the route
  res.locals.currentUser  = req.user;
  // add flash message into local variable in response
  res.locals.error        = req.flash("error");
  res.locals.success      = req.flash("success");
  next();
});

// ====== ROUTES ======
app.use('/',      IndexRoutes);
app.use('/books', BookRoutes);

app.listen(3000, () => {
  console.log("Server is up and running...");
});
