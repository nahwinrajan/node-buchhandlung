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
    expressSession  = require('express-session'),
    mongoStore      = require('connect-mongo')(expressSession);
    passport        = require('passport'),
    flash           = require('connect-flash'),
    validator       = require('express-validator'),
    FileStreamRotator= require('file-stream-rotator'),
    fs              = require('fs'),
    favicon         = require('serve-favicon');
    helmet          = require('helmet'),
    csrf            = require('csurf'),
    seedDB          = require('./seeds');

// variables - routes
var IndexRoutes           = require("./routes/index"),
    BookRoutes            = require("./routes/books"),
    UserRoutes            = require("./routes/users");

// variables - others
var logDirectory  = path.join(__dirname, 'logs');


// app configuration
app.set("view engine", "ejs");

app.use(favicon(__dirname + '/public/images/favicon.ico'))
app.use(morgan('dev'));
app.use(helmet());    // protect from some well know http vulnerability by setting approriate header
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
app.use(validator());
app.use(expressSanitizer()); //sanitize user's html encoding inputpr
app.use(expressSession({
  secret: "some secret password for session",
  resave: false,               //don't kept saving session on server
  saveUninitialized: false,    //do not save session that has nothing in it
  store:  new mongoStore( { mongooseConnection: mongoose.connection } ),
  cookie: { maxAge: 60 * 60 * 1000 }
}));
app.use(flash());
//csurf relies on cookie/express-session therefore use it after initializing session middleware
app.use(csrf());

// db - configuration
let dbUrl = process.env.DBURL || "mongodb://localhost/buchhandlung";
mongoose.connect(dbUrl);
// seedDB();

// passport - authentication
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

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

//set up local variables for every view
app.use(function(req, res, next) {
  // req.user is property set by passport
  // req.locals.variableName => this how we set local variable on view for the route
  res.locals.currentUser  = req.user;
  res.locals.cart         = req.session.cart;

  // add flash message into local variable in response
  res.locals.error        = req.flash("error");
  res.locals.success      = req.flash("success");
  next();
});

// ====== ROUTES ======
app.use('/',      IndexRoutes);
app.use('/books', BookRoutes);
app.use('/users', UserRoutes);

// Since this is the last non-error-handling
// middleware use()d, we assume 404, as nothing else
// responded.
app.use(function(req, res, next) {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('500', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('500', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
