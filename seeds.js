const mongoose      = require("mongoose");
const faker         = require("faker");

let Book    = require("./models/book"),
    User    = require("./models/user"),
    Order   = require("./models/order");

function seedDB() {
  Order.remove({}, err => {
    if (err) console.log(err);
    else console.log("Orders Collection - cleaned up");
  });

  Book.remove({}, (err) => {
    if (err) console.log(err);
    else {
      console.log("Books Collection - cleaned up");
      seedBooks();
    }
  });

  User.remove({}, (err) => {
    if (err) console.log(err);
    else {
      console.log("Users Collection - cleaned up");
      seedUsers();
    }
  });
};

function seedBooks() {
  let books = [];
  for(let i=0; i < 10; i++) {
    books.push({
      title: faker.commerce.productName(),
      description: faker.lorem.paragraphs(2), // 2 paragraphs; the default is 3
      rating: (Math.ceil(Math.random() * (6+0) + 0)),
      price: faker.commerce.price(0, 50, 2),  //min: 0, max: 50, decimal point: 2
      pages: faker.random.number(),
      publishDate: faker.date.past(),
      isbn: (Math.round(Math.random() * (9999999999999 + 1000000000000) + 1000000000000)).toString(),
    });
  }

  Book.create(books, (err, results) => {
    if (err) console.log(err);
    else console.log("Books Collection - seeded");
  });
};

function seedUsers() {
  let dummyUser = new User({
    name: "dummy",
    email: "dummy@email.com"
  });
  dummyUser.password = dummyUser.encryptPassword("password");

  let users = [
    {
      name: "Sherlock Holmes",
      email: "sherlock@example.com",
      password: dummyUser.password,
    },
    {
      name: "Albus Dumbledore",
      email: "albus@example.com",
      password: dummyUser.password,
    },
    {
      name: "Nikola Tesla",
      email: "nikola@example.com",
      password: dummyUser.password,
    },
    {
      name: "Charlie Brown",
      email: "charlie@example.com",
      password: dummyUser.password,
    },
  ]

  User.create(users, (err, results) => {
    if (err) console.log(err);
    else console.log("Users Collection - seeded");
  });
}

module.exports = seedDB;
