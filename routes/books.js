var express       = require('express'),
    router        = express.Router();

// variables - models
var Book = require("./../models/book");

// variables - middleware
var middlewareObj = require('./../middlewares');

// variable - helper

// return all books
router.get('/', (req, res) => {
  Book.all( (err, data) => {
    if (err) {
      console.log(err);
      res.render("500");
    } else {
      res.render('books/index', { books: data });
    }
  });
});

// show new form
router.get('/new', middlewareObj.isLoggedIn, (req, res) => {
  res.render("books/new", {csrf: req.csrfToken()} );
});

// create new book listing
router.post('/', middlewareObj.isLoggedIn, (req, res) => {
  req.checkBody('book[title]', 'Invalid Title').notEmpty().isLength({max: 250});
  req.checkBody('book[description]', 'Description is required').notEmpty();
  req.checkBody('book[pages]', 'Description is required').notEmpty().isInt();
  req.checkBody('book[price]', 'Description is required').notEmpty();
  req.checkBody('book[publishDate]', 'Description is required').notEmpty();
  req.checkBody('book[isbn]',
    'ISBN is required and must be 13 characters of digits').notEmpty()
    .isLength({max: 13, min: 13});

    let errors = req.validationErrors();
    if (errors) {
      req.flash("error", errors[0]);
      res.redirect("back");
    }

  Book.create(req.body.book, (err, data) => {
    if(err) {
      console.log(err);
      req.flash("error", "Can't create book");
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      req.flash("success", data.title + " created");
      res.redirect("/books/" + data.id);
    }
  });
});

// show particular book
router.get('/:id', (req, res) => {
  Book.findById(req.params.id, function (err, data) {
    if (err) {
      console.log(err);
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      res.render("books/show", { book: data });
    }
  });
});

// show edit form
router.get('/:id/edit', middlewareObj.isLoggedIn, (req, res) => {
  Book.findById(req.params.id, function (err, data) {
    if (err) {
      console.log(err);
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      res.render("books/edit", { book: data, csrf: req.csrfToken() });
    }
  });
});

// update book listing
router.put("/:id", middlewareObj.isLoggedIn , (req, res) => {
  req.body.book.title           = req.sanitize(req.body.book.title);
  req.body.book.description     = req.sanitize(req.body.book.description);
  req.body.book.isbn            = req.sanitize(req.body.book.isbn);

  req.checkBody('book[title]', 'Invalid Title').notEmpty().isLength({max: 250});
  req.checkBody('book[description]', 'Description is required').notEmpty();
  req.checkBody('book[pages]', 'Description is required').notEmpty().isInt();
  req.checkBody('book[price]', 'Description is required').notEmpty();
  req.checkBody('book[publishDate]', 'Description is required').notEmpty();
  req.checkBody('book[isbn]',
    'ISBN is required and must be 13 characters of digits').notEmpty()
    .isLength({max: 13, min: 13});

  let errors = req.validationErrors();
  if (errors) {
    let msg = [];
    errors.forEach(function(error) {
      message.push(err.msg);
    });
    req.flash("error", msg);
    res.redirect("back");
  }

  Book.findByIdAndUpdate(req.params.id, req.body.book, (err, data) => {
    if(err) {
      req.flash("error", "Can't update book");
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      req.flash("success", data.title + " updated");
      res.redirect("/books/" + data.id);
    }
  });
});

// delete book
router.delete("/:id", middlewareObj.isLoggedIn, (req, res) => {
  Book.findByIdAndRemove(req.params.id, (err, data) => {
    if(err) {
      console.log(err);
      req.flash("error", "Can't remove book");
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      req.flash("success", data.title + " removed");
      res.redirect("/");
    }
  });
});

module.exports= router;
