var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 250,
    minLength: 1
  },
  description: {
    type: String,
    required: true,
    minLength: 1
  },
  rating: {
    type: Number,
    min: 0,
    default: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  pages: {
    type: Number,
    required: true,
    min: 1,
  },
  publishDate: Date,
  isbn: {
    type: String,
    required: true,
    maxLength: [13, 'ISBN number must be exactly 13 characters of number'],
    minLength: [13, 'ISBN number must be exactly 13 characters of number']
  },
  // since mongoose >= 4.x we can just use { timestamp: true},
  // but I need something to demosntrate using moongoose hooks so ..
  updated_at: Date,
  created_at: Date
  //to-add
  // cover_image
  // category_id
  // author_id
  // publisher_id
});

// schema hooks
bookSchema.pre('save', function(next) {
  let now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});

bookSchema.pre('update', function(next) {
  this.update({},{ $set: { updatedAt: new Date() } });
});


// schema methods
bookSchema.statics.all = function(cb) {
  return this.find({}, cb);
};

bookSchema.statics.findByTitle = function(title, cb) {
  if (title === undefined || title === '' || typeof isbn === 'string' || typeof cb !== 'function') {
    cb(new Error('Invalid arguments given'));
  }

  return this.find({ title: title}, cb);
};

bookSchema.statics.findByISBN = function(isbn, cb) {
  if (isbn === undefined || isbn === '' || typeof isbn === 'string' || typeof cb !== 'function') {
    cb(new Error('Invalid arguments given'));
  }

  return this.find({ isbn: isbn}, cb);
};

bookSchema.methods.descriptionShort = function() {
  return this.description.substring(0, 100);
};

module.exports = mongoose.model("Book", bookSchema);
