var express = require('express'),
    router = express.Router();

// variables - models
var Book = require("./../models/book"),
    Cart = require("./../models/cart");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/books');
});

router.get('/addtocart/:id', function(req, res) {
  let itemId = req.params.id;
  let originalUrl = (req.query.origin) ? req.sanitize(req.query.origin) : "/books";

  Book.findById(itemId, function(err, book) {
    if(err) {
      req.flash("error", "failed to add book to cart");
      res.redirect(originalUrl);
    } else {
      let cart = new Cart((req.session.cart) ? req.session.cart : {});
      cart.add(book, itemId);

      req.session.cart = cart;
      res.redirect(originalUrl);
    }
  });
});

router.get('/reducefromcart/:id', function(req, res) {
  let itemId = req.params.id;
  let originalUrl = (req.query.origin) ? req.sanitize(req.query.origin) : "/books";

  if(itemId) {
    let cart = new Cart((req.session.cart) ? req.session.cart : {});
    cart.reduceByOne(itemId);

    req.session.cart = cart;
  }

  res.redirect(originalUrl);
});

router.get('/removefromcart/:id', function(req, res) {
  let itemId = req.params.id;
  let originalUrl = (req.query.origin) ? req.sanitize(req.query.origin) : "/books";

  if (itemId) {
    let cart = new Cart((req.session.cart) ? req.session.cart : {});
    cart.delete(itemId);

    req.session.cart = cart;
  }

  res.redirect(originalUrl);
});

router.get('/cart', function(req, res) {
  let cart = new Cart((req.session.cart) ? req.session.cart : {});
  res.render('cart/index', { items: cart.generateItemsAsArray(), totalPrice: cart.totalPrice });
});

module.exports = router;
