let mongoose      = require("mongoose");
let faker         = require("faker");

let Book    = require("./models/book");

function seedDB() {
  Book.remove({}, (err) => {
    if (err) {
      console.log("seedDB encountered some error: \n" + err.message + "\n\n" + err.stack);
    } else {
      console.log("Book Collection - cleaned up");
    }
  });

  for(let i=0; i < 101; i++) {
    Book.create({
      title: faker.name.title(),
      description: faker.lorem.paragraphs(),
      rating: (Math.ceil(Math.random() * (6+0) + 0)),
      price: faker.commerce.price(),
      pages: faker.random.number(),
      publishDate: faker.date.past(),
      isbn: (Math.round(Math.random() * (9999999999999 + 1000000000000) + 1000000000000)).toString()
    });
  }

  console.log("Book Collection - populated");
}

module.exports = seedDB;
