const Product = require('../model/productModel');
const catchAsync = require('../utils/catchAsync');
const User = require('../model/userModel');
const AppError = require('./../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get product data from collection
  const products = await Product.find();

  // 2) Build template
  // 3) Render that template using product data from 1)
  res.status(200).render('overview', {
    title: 'All Products',
    products,
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested product (including reviews and guides)
  const product = await Product.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!product) {
    return next(new AppError('There is no product with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('product', {
    title: `${product.name} Product`,
    product,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
