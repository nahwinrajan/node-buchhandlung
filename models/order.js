var mongoose = require('mongoose');

// variables - models

var orderSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  // shippingAddress: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'ShippingAddress',
  //   required: true
  // },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  // paymentId from stripe
  paymentId: {
    type: String
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  items: {
    type: Object,
    ref: 'OrderItem'
  },
  // since mongoose >= 4.x we can just use { timestamp: true},
  // but I need something to demosntrate using moongoose hooks so ..
  updated_at: Date,
  created_at: Date
});

orderSchema.pre('save', (next) => {
  let now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});

orderSchema.pre('update', (next) => {
  this.updated_at = new Date();
  next();
});

orderSchema.statics.all = (cb) => {
  if (arguments.length < 1 || typeof cb !== 'function') {
    return cb(new Error('Invalid arguments given'));
  }

  return this.find({}, cb);
};

orderSchema.statics.findById = (idKeyword, withDetails, cb) => {
  if (arguments.length < 3 || !idKeyword || typeof idKeyword !== 'string' ||
  typeof withDetails !== 'boolean' || typeof cb !== 'function') {
    cb(new Error('Invalid arguments given'));
  }

  if (withDetails) {
    this.findById(idKeyword, cb);
  } else {
    this.findById(idKeyword, {items: 0}, cb);
  }
};

orderSchema.statics.findByCustomer = (customerId, cb) => {
  if (arguments.length < 2 || !customerId || typeof customerId !== 'string' ||
  typeof cb !== 'function') {
    return cb(new Error('Invalid arguments given'));
  }

  return this.find({customer: customerId}, cb);
};

orderSchema.statics.findOrderAndPopulateItems = (idKeyword, cb) => {
  if (arguments.length < 2 || !idKeyword || typeof idKeyword !== 'string' ||
  typeof cb !== 'function') {
    return cb(new Error('Invalid arguments given'));
  }

  return this.findById({_id: idKeyword}).populate('items');
};

module.exports = mongoose.model("Order", orderSchema);
