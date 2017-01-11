var mongoose              = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose'),
    bcrypt                = require('bcryptjs');

var userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 50,
    minLength: 1
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  updated_at: Date,
  created_at: Date
});

// schema hooks
userSchema.pre('save', function(next) {
  let now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});

userSchema.pre('update', function(next) {
  this.update({},{ $set: { updatedAt: new Date() } });
});

userSchema.statics.findByEmail = function(_email, cb) {
  if (_email === undefined || _email === '' || typeof cb !== 'function') {
    cb(new Error('Invalid arguments given'));
  }

  return this.findOne({ email: _email}, cb);
};

userSchema.methods.encryptPassword = function(_password) {
  return bcrypt.hashSync(_password, 10);
}

userSchema.methods.comparePassword = function(_password) {
  return bcrypt.compareSync(_password, this.password);
}

module.exports = mongoose.model('User', userSchema);
