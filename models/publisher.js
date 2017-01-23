var mongoose = require('mongoose');

var publisherSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 75,
    minLength: 1
  },
  about: {
    type: String,
    required: true,
    minLength: 1
  },
  site: {
    Type: String,
    required: true
  }
  // since mongoose >= 4.x we can just use { timestamp: true},
  // but I need something to demosntrate using moongoose hooks so ..
  updated_at: Date,
  created_at: Date
});

// schema hooks
publisherSchema.pre('save', (next) => {
  let now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});

publisherSchema.pre('update', (next) => {
  this.updated_at = new Date();
  next();
});


// schema methods
publisherSchema.statics.all = (cb) => {
  if (arguments.length < 1 || typeof cb !== 'function') {
    return cb(new Error('Invalid arguments given'));
  }

  return this.find({}, cb);
};

publisherSchema.statics.findByName = (nameKeyword, cb) => {
  if (arguments.length < 2 || !nameKeyword || typeof nameKeyword !== 'string' ||
  typeof cb !== 'function') {
    return cb(new Error('Invalid arguments given'));
  }


  return this.find({ name: nameKeyword}, cb);
};


module.exports = mongoose.model("Publisher", publisherSchema);
