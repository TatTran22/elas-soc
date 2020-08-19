const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
    trim: true,
    maxlength: [40, 'A user name must have less or equal then 40 characters'],
    minlength: [5, 'A user name must have more or equal then 5 characters']
  },
  //   nested: {
  //     firstName: {
  //       type: String,
  //       required: [false, 'A user must have first name'],
  //       trim: true
  //     },
  //     lastName: {
  //       type: String,
  //       required: [false, 'A user must have a name'],
  //       trim: true
  //     }
  //   },
  email: {
    type: String,
    required: [true, 'Pleas provide your email.'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email.']
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'guide', 'lead-guide'],
    default: 'user'
  },
  photo: {
    type: String,
    required: false,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Pleas provide a password.'],
    maxlength: [40, 'Password must have less or equal then 20 characters'],
    minlength: [5, 'Password must have more or equal then 5 characters'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Pleas confirm your password.'],
    validate: {
      // This only works on CREAT and SAVE!!!
      validator: function(el) {
        return el === this.password;
      },
      massage: 'Password are not the same!'
    }
  },
  passwordChangedAt: {
    type: Date
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; // -1s đẻ chắc chắn rằng token được tạo ra sau khi password được thay đổi
  next();
});

userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
