var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
  title: {
    type: String,
    index: true,
    required: true,
    maxLength: 250,
    minLength: 1
  },
  description: {
    type: String,
    required: true
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
    index: true,
    required: true,
    maxLength: [13, 'ISBN number must be exactly 13 characters of number'],
    minLength: [13, 'ISBN number must be exactly 13 characters of number']
  },
  authors: [
    {
      type: String,
      required: true
    }
  ],
  publisher: {
    type: String,
    required: true
  },
  coverImage: String,
  coverKey: String,
  // since mongoose >= 4.x we can just use { timestamp: true},
  // but I need something to demosntrate using moongoose hooks so ..
  updated_at: Date,
  created_at: Date
});

// schema hooks
bookSchema.pre('save', function bookPreSave(next) {
  let now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});

bookSchema.pre('update', function bookPreUpdate(next) {
  this.updated_at = new Date();
  next();
});


// schema methods
bookSchema.statics.all = function bookGetAll(cb) {
  if (arguments.length < 1 || typeof cb !== 'function') {
    return cb(new Error('Invalid arguments given'));
  }

  return this.find({}, cb);
};

bookSchema.statics.findByTitle = function bookFindByTitle(titleKeyword, cb) {
  if (arguments.length < 2 || !titleKeyword || typeof titleKeyword !== 'string'
  || typeof cb !== 'function') {
    return cb(new Error('Invalid arguments given'));
  }

  return this.find({ title: titleKeyword}, cb);
};

bookSchema.statics.findByISBN = function bookFindByISBN(isbnKeyword, cb) {
  if (arguments.length < 2 || !isbnKeyword || typeof isbnKeyword !== 'string' ||
   typeof cb !== 'function') {
    cb(new Error('Invalid arguments given'));
  }

  return this.find({ isbn: isbn}, cb);
};

bookSchema.methods.descriptionShort = function bookDescriptionShort() {
  return this.description.substring(0, 100);
};

bookSchema.methods.publishDateShort = function bookPublishDateShort() {
  return this.publishDate.toISOString().substring(0, 10);
};

module.exports = mongoose.model("Book", bookSchema);
