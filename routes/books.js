var express       = require('express'),
    router        = express.Router();

// variables - models
var Book = require("./../models/book");

// variables - middleware

// variable - helper

// return all books
router.get('/', function(req, res) {
  Book.all(function (err, foundBooks) {
    if (err) {
      console.log("ERROR: " + (err.name) ? err.name : "");
      console.log(err);
      res.redirect("back");
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
router.post('/', function (req, res) {
  req.body.book.title           = req.sanitize(req.body.book.title);
  req.body.book.description     = req.sanitize(req.body.book.description);
  req.body.book.isbn            = req.sanitize(req.body.book.isbn);

  Book.create(req.body.book, function (err, createdBook) {
    if(err) {
      console.log("Error encountered: \n ------------- \n", err);
      req.flash("error", "Can't create book");
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      req.flash("success", createdBook.title + " created");
      res.redirect("/books/" + createdBook.id);
    }
  });
});

// show particular book
router.get('/:id', function (req, res) {
  Book.findById(req.params.id, function (err, foundBook) {
    if (err) {
      console.log("ERROR: " + (err.name) ? err.name : "");
      console.log(err);
      req.flash("error", err.message);
      res.redirect("back");
    } else if (foundBook === null) {
      console.log("book not found: " + req.params.id);
      req.flash("error", "The book you are searching is not found");
      res.redirect("back");
    } else {
      res.render("books/show", { book: foundBook});
    }
  });
});

// show edit form
router.get('/:id/edit', function (req, res) {
  Book.findById(req.params.id, function (err, foundBook) {
    if (err) {
      console.log("ERROR: " + (err.name) ? err.name : "");
      console.log(err);
      req.flash("error", err.message);
      res.redirect("back");
    } else if (foundBook === null) {
      console.log("book not found: " + req.params.id);
      req.flash("error", "The book you are searching for is not found");
      res.redirect("back");
    } else {
      res.render("books/edit", { book: foundBook});
    }
  });
});

// update book listing
router.put("/:id", function (req, res) {
  req.body.book.title           = req.sanitize(req.body.book.title);
  req.body.book.description     = req.sanitize(req.body.book.description);
  req.body.book.isbn            = req.sanitize(req.body.book.isbn);

  Book.findByIdAndUpdate(req.params.id, req.body.book, function (err, updatedBook) {
    if(err) {
      req.flash("error", "Can't update book");
      req.flash("error", err.message);
      res.redirect("back");
    } else if (updatedBook === null) {
      console.log("book not found: " + req.params.id);
      req.flash("error", "The book you are trying to update is not found");
      res.redirect("back");
    } else {
      req.flash("success", updatedBook.title + " updated");
      res.redirect("/books/" + updatedBook.id);
    }
  });
});

// delete book
router.delete("/:id", function (req, res) {
  Book.findByIdAndRemove(req.params.id, function(err, deletedBook) {
    if(err) {
      console.log(err); //todo: change all error loggin to separate file
      req.flash("error", "Can't remove book");
      req.flash("error", err.message);
      res.redirect("back");
    } else if (deletedBook === null) {
      console.log("book not found: " + req.params.id);
      req.flash("error", "The book you are trying to delete is not found");
      res.redirect("back");
    } else {
      req.flash("success", deletedBook.title + " removed");
      res.redirect("/");
    }
  });
});

module.exports= router;
