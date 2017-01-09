var express       = require('express'),
    router        = express.Router();

// variables - models
var Book = require("./../models/book");

// variables - middleware

// variable - helper
var forbidden     = require('./../helpers/response/forbidden');
var notFound      = require('./../helpers/response/notFound');
var serverError   = require('./../helpers/response/serverError');

// return all books
router.get('/', function(req, res) {
  Book.all((err, foundBooks) => {
    if (err) {
      serverError(err, req, res);
    } else {
      res.render('books/index', { books: foundBooks });
    }
  });
});

// show new form
router.get('/new', function(req, res) {
  res.render("books/new");
});

// create new book listing
router.post('/', function(req, res) {
  req.body.book.title           = req.sanitize(req.body.book.title);
  req.body.book.description     = req.sanitize(req.body.book.description);
  req.body.book.isbn            = req.sanitize(req.body.book.isbn);

  Book.create(book, (err, createdBook) => {
    if(err) {
      req.flash("error", "Can't create book");
      res.redirect("back");
    } else {
      req.flash("success", createdBook.title + " created");
      res.redirect("/" + createdBook.id);
    }
  });
});

// show particular book
router.get('/:id', (req, res) => {
  Book.findById(req.params.id, (err, foundBook) => {
    if (err) {
      console.log(err);
      notFound(err, req, res);
    } else {
      res.render("books/show", { book: foundBook});
    }
  });
});

// show edit form
router.get('/:id/edit', (req, res) => {
  Book.findById(req.params.id, (err, foundBook) => {
    if (err) {
      console.log(err);
      notFound(err, req, res);
    } else {
      res.render("books/edit", { book: foundBook});
    }
  });
});

// update book listing
router.put("/:id", (req, res) => {
  req.body.book.title           = req.sanitize(req.body.book.title);
  req.body.book.description     = req.sanitize(req.body.book.description);
  req.body.book.isbn            = req.sanitize(req.body.book.isbn);

  Book.findByIdAndUpdate(req.params.id, req.body.book, (err, updatedBook) => {
    if(err) {
      req.flash("error", "Can't update book");
      res.redirect("back");
    } else {
      req.flash("success", updatedBook.title + " updated");
      res.redirect("/" + updatedBook.id);
    }
  });
});

// delete book
router.delete("/:id", (req, res) => {
  Book.findByIdAndRemove(req.params.id, function(err, deletedBook) {
    if(err) {
      console.log(err); //todo: change all error loggin to separate file
      req.flash("error", "Can't remove book");
      res.redirect("back");
    } else {
      req.flash("success", deletedBook.title + " removed");
      res.redirect("/");
    }
  });
});

module.exports= router;
