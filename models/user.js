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
    index: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  updated_at: Date,
  created_at: Date
});

// schema hooks
userSchema.pre('save', function userPreSave(next) {
  let now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }

  next();
});

userSchema.pre('update', function userPreUpdate(next) {
  this.updated_at = new Date();
  next();
});

userSchema.statics.findByEmail = function userFindByEmail(emailKeyword, cb) {
  if (arguments.length < 2 || !emailKeyword || typeof emailKeyword !== 'string'
  || typeof cb !== 'function') {
    return cb(new Error('Invalid arguments given'));
  }

  return this.findOne({ email: emailKeyword}, cb);
};

userSchema.methods.encryptPassword = function userEncryptPass(_password) {
  return bcrypt.hashSync(_password, 10);
};

userSchema.methods.comparePassword = function userComparePass(_password) {
  return bcrypt.compareSync(_password, this.password);
};

module.exports = mongoose.model('User', userSchema);
