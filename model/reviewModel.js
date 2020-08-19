const mongoose = require('mongoose');
const Device = require('./productModel');
// const catchAsync = require('./../utils/catchAsync');

const reviewShema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Device',
      required: [true, 'Review must belong to a product.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// không cho người dùng viết >1 review cho một product
reviewShema.index({ product: 1, user: 1 }, { unique: true });

reviewShema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'product',
  //   select: 'name'
  // });
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  this.start = Date.now();

  next();
});

reviewShema.post(/^find/, function (docs, next) {
  console.log(`Review query took ${Date.now() - this.start} milliseconds.`);

  next();
});

reviewShema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  console.log(stats);
  if (stats.length > 0) {
    await Device.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Device.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewShema.post('save', function () {
  // this point to current review
  this.constructor.calcAverageRatings(this.product);
});

reviewShema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewShema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.product);
});

const Review = mongoose.model('Review', reviewShema);

module.exports = Review;
