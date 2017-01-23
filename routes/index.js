var express = require('express'),
    router = express.Router();

// variables - models
var Book  = require("./../models/book"),
    Cart  = require("./../models/cart"),
    Order = require("./../models/order");

// variables - middleware
var middlewareObj = require("./../middlewares");

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/books');
});

router.get('/addtocart/:id', (req, res) => {
  let itemId = req.params.id;
  let originalUrl = (req.query.origin) ? req.sanitize(req.query.origin) : "/books";

  Book.findById(itemId, (err, book) => {
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

router.get('/reducefromcart/:id', (req, res) => {
  let itemId = req.params.id;
  let originalUrl = (req.query.origin) ? req.sanitize(req.query.origin) : "/books";

  if(itemId) {
    let cart = new Cart((req.session.cart) ? req.session.cart : {});
    cart.reduceByOne(itemId);

    req.session.cart = cart;
  }

  res.redirect(originalUrl);
});

router.get('/removefromcart/:id', (req, res) => {
  let itemId = req.params.id;
  let originalUrl = (req.query.origin) ? req.sanitize(req.query.origin) : "/books";

  if (itemId) {
    let cart = new Cart((req.session.cart) ? req.session.cart : {});
    cart.delete(itemId);

    req.session.cart = cart;
  }

  res.redirect(originalUrl);
});

router.get('/cart', (req, res) => {
  let cart = new Cart((req.session.cart) ? req.session.cart : {});
  res.render('cart/index', { items: cart.generateItemsAsArray(), totalPrice: cart.totalPrice });
});

router.get('/checkout', middlewareObj.isLoggedIn, (req, res) => {
  if(!req.session.cart || req.session.cart.totalQty < 1) {
    res.redirect('/books');
  }

  res.render('cart/checkout', {csrf: req.csrfToken() });
});

router.post('/checkout', middlewareObj.isLoggedIn, (req, res) => {
  // make sure that cart session exist
  if(!req.session.cart || req.session.cart < 1) {
    return res.redirect('/checkout');
  }

  // in real world there are possibility of failure when asking stripe to charge customer
  // or when we are trying to update our system (insert or the order to our DB)
  // therefor in real world the flows should be as following:
  // 1. create unpaid/uncharged order in our db
  // 2. upon successful insert we continue to create charge via Stripe
  // 3. upon successful charge with Stripe we update the order as paymentId
  // * in the event of failure charge with Stripe or Update order status to paid,
  // we should have somesort table for web worker/consolidation process that run on constant
  // interval to sort the issue (try to charge and update again)


  // that being said, this showcase app will not have consolidation process for simplicity sake


  let order = new Order({
    customer  : req.user,
    price     : req.session.cart.totalPrice,
    quantity  : req.session.cart.totalQty,
    paymentId : '', //we haven't charge the customer yet,
    isPaid    : false,
    items     : req.session.cart.items
  });

  console.log("==== order object: ", order);
  console.log("==== cart object: ", req.session.cart);

  // updating payment status after charging customer
  let cbUpdateOrder = (err, updatedOrder) => {
    if (err) {
      // another place where we should update the consolidation process
      req.flash("error", "order received and paid but there was problem with updating order status, we'll try again later and notify you");
      res.redirect("/books");
    } else {
      req.flash("success", "Thank you!! your order is received and under process for shipping");
      res.redirect("/books");
    }
  };

  // TODO: implement promise or use Async.JS to avoid this callback hell
  order.save((err, createdOrder) => {
    if(err) {
      req.flash("error", err.message);
      res.redirect('/checkout');
    } else {
      let stripe = require("stripe")(
        "sk_test_ZPQR9df15JppXN2tJZY0E6HC"
      );

      stripe.charges.create({
        amount: req.session.cart.totalPrice * 100,
        currency: "sgd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Bucchandlung - " + req.session.totalQty + " book(s)"
      }, (err, charge) => {
        if (err) {
          // this is where we should update our consolidation process / table
          // but for now let's just redirect to checkout
          req.flash("error", "order received but there was problem with payment, we'll try again later and notify you");
          res.redirect("/books");
        } else {
          createdOrder.paymentId = charge.id;
          createdOrder.isPaid    = true;
          Order.findByIdAndUpdate(createdOrder._id, createdOrder, cbUpdateOrder);
        }
      });
    }
  });
});

module.exports = router;
