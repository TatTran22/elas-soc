const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const Review = require('./reviewModel');
// const validator = require('validator');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name.'],
      unique: true,
      trim: true
      // maxlength: [
      //   40,
      //   'A product name must have less or equal then 40 characters',
      // ],
      // minlength: [
      //   10,
      //   'A product name must have more or equal then 40 characters',
      // ],
      // validate: [validator.isAlpha, 'Product name must only contain character.']
    },
    orderCode: {
      type: String,
      required: [true, 'A product must have a order code.'],
      unique: true,
      trim: true
    },
    slug: String,
    catalogDescription: {
      type: String,
      trim: true,
      required: [true, 'A product must have a short description.']
    },
    longDescription: {
      type: String,
      trim: true,
      required: [true, 'A product must have a long description.']
    },
    imageUrl: {
      type: String,
      required: [true, 'A product must have a cover image.']
    },
    images: [String],
    ean: {
      type: String,
      required: [true, 'A product must have a EAN.']
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on NEW document creation.
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    price: {
      type: Number,
      require: [true, 'A product must have a price.']
    },
    minimumOrderQuantity: {
      type: Number
    },
    unit: {
      type: String
    },
    unit_vn: {
      type: String
    },

    //Dimensions
    netLength: {
      type: Number
    },
    netHeight: {
      type: Number
    },
    netWidth: {
      type: Number
    },
    netWeight: {
      type: Number
    },
    netLengthUnit: {
      type: String
    },
    netWeightUnit: {
      type: String
    },

    originalLink: {
      type: String
    },

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    secretProduct: {
      type: Boolean,
      default: false
    },

    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// productSchema.index({ price: 1 });
productSchema.index({ price: 1, ratingsAverage: -1 });
productSchema.index({ slug: 1 });
productSchema.index({ startLocation: '2dsphere' });

// productSchema.virtual('durationWeeks').get(function () {
//   return this.duration / 7;
// });

// Virtual populate
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id'
});

//DOCUMENT MIDDLEWARE: run before .save() and .creat()
productSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// productSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// productSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// productSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// được trigger khi  bất kỳ command nào bắt đầu với find được hook tới, xử lý middware này trước r tiếp tục
productSchema.pre(/^find/, function(next) {
  this.find({ secretProduct: { $ne: true } }); // tiền xử lý find* command

  this.start = Date.now();
  next();
});

productSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});

productSchema.post(/^find/, function(docs, next) {
  console.log(`Product query took ${Date.now() - this.start} milliseconds.`);

  next();
});

// AGGREGATION MIDDLEWARE
// productSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretProduct: { $ne: true } } });

//   next();
// });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
