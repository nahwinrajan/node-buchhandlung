const mongoose      = require("mongoose");
const faker         = require("faker");

const Book    = require("./models/book"),
      User    = require("./models/user");

function seedDB() {
  Book.remove({}, (err) => {
    if (err) {
      console.log("seedDB encountered some error: \n" + err.message + "\n\n" + err.stack);
    } else {
      console.log("Book Collection - cleaned up");
    }
  });

  for(let i=0; i < 10; i++) {
    Book.create({
      title: faker.commerce.productName(),
      description: faker.lorem.paragraphs(2), // 2 paragraphs; the default is 3
      rating: (Math.ceil(Math.random() * (6+0) + 0)),
      price: faker.commerce.price(0, 50, 2),  //min: 0, max: 50, decimal point: 2
      pages: faker.random.number(),
      publishDate: faker.date.past(),
      isbn: (Math.round(Math.random() * (9999999999999 + 1000000000000) + 1000000000000)).toString()
    });
  }

  console.log("Book Collection - populated");

  User.remove({}, (err) => {
    if (err) {
      console.log("seedDB encountered some error: \n" + err.message + "\n\n" + err.stack);
    } else {
      console.log("User Collection - cleaned up");
    }
  });

  let sherlock = new User({
    name: "Sherlock Holmes",
    email: "sherlock@example.com"
  });
  sherlock.password = sherlock.encryptPassword("password");
  sherlock.save();

  let albus = new User({
    name: "Albus Dumbledore",
    email: "albus@example.com"
  });
  albus.password = albus.encryptPassword("password");
  albus.save();

  let nikolas = new User({
    name: "Nikolas Tesla",
    email: "nikolas@example.com"
  });
  nikolas.password = nikolas.encryptPassword("password");
  nikolas.save();


  console.log('---- seeding done ----');
}

module.exports = seedDB;
