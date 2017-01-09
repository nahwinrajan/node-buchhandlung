var mongoose = require('mongoose');

var authorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 50,
    minLength: 1
  },
  about: {
    type: String,
    required: true,
    minLength: 1
  }
  // since mongoose >= 4.x we can just use { timestamp: true},
  // but I need something to demosntrate using moongoose hooks so ..
  updated_at: Date,
  created_at: Date
});

// schema hooks
authorSchema.pre('save', (next) => {
  let now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});

authorSchema.pre('update', (next) => {
  this.update({},{ $set: { updatedAt: new Date() } });
});


// schema methods
authorSchema.statics.all = (cb) => {
  return this.find({}, cb);
};

authorSchema.statics.findByName = (name, cb) => {
  if (title === undefined || title === '' || typeof isbn === 'string' || typeof cb !== 'function') {
    cb(new Error('Invalid arguments given'));
  }

  return this.find({ name: name}, cb);
};

authorSchema.statics.findByIdAndUpdate = (id, data, cb) => {
  if (id === undefined || id === '' || typeof cb !== 'function' || data === undefined || typeof data !== 'object') {
    cb(new Error('Invalid arguments given'));
  }

  return this.findByIdAndUpdate(id, data, cb);
};


module.exports = mongoose.model("Author", authorSchema);
