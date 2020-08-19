const Product = require('../model/productModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

exports.aliasTopProducts = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product, { path: 'reviews' });
exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);

// exports.deleteProduct = catchAsync(async (req, res, next) => {
//   const product = await Product.findByIdAndDelete(req.params.id);

//   if (!product) {
//     return next(new AppError('No product found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
// });

exports.getProductStats = catchAsync(async (req, res, next) => {
  const stats = await Product.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numProducts: { $sum: 1 }, //numProducts đếm số lượng documents. mỗi doc lại cộng thêm một nên ở đây điền 1
        numRating: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $min: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    //,
    // dùng để excluding một trong các doc lấy được từ bên trên
    // {
    //   $match: {
    //     _id: { $ne: 'EASY' }
    //   }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: stats,
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Product.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numProductsStats: { $sum: 1 },
        products: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numProductsStats: -1 },
    },
    {
      $limit: 12, // giống limit ở query, giới hạn số kết quả tìm được, ở đây đang để 12 như một reference
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: { plan },
  });
});
