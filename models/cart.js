// basically when we store js data in session
// the most complext type it can be is json-ish thing
// that mean it won't retain function or anything fancier than key value pair
// that is why we need to create the cart model object each time creating a new one
module.exports = function Cart(oldCart) {
  this.items = (oldCart.items) ? oldCart.items : {};
  this.totalQty = (oldCart.totalQty) ? oldCart.totalQty : 0;
  this.totalPrice = (oldCart.totalPrice) ? oldCart.totalPrice :  0;

  this.add = function(item, id) {
    // since we store selected items in object
    // we can directly access desired item by referring to it's key id
    let storedItem = this.items[id];

    // add the item if it doesn't exist
    if (!this.items[id]) {
      this.items[id] = {
        _id: id,
        title: item.title,
        price: item.price,
        qty: 0,
        subTotal: 0
      };
    }
    this.items[id].qty++;
    this.items[id].subTotal = this.items[id].qty * this.items[id].price;

    this.totalQty++;
    // because we'll only add 1 at a time
    this.totalPrice += this.items[id].price;
  };

  this.delete = function(id) {
    // avoid non-existent / index out of range matter
    if(this.items[id]) {
      this.totalQty -= this.items[id].qty;
      this.totalPrice -= this.items[id].subTotal;

      delete this.items[id];
    }
  }

  this.reduceByOne = function(id) {
    if (this.items[id] && this.items[id].qty > 1) {
      this.items[id].qty--;
      this.items[id].subTotal -= this.items[id].price;

      this.totalQty--;
      this.totalPrice -= this.items[id].price;
    }
  }

  this.generateItemsAsArray = function() {
    let arr = [];

    for(let id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
}
