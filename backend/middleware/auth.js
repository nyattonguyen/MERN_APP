const catchAsyncErrors = require('./catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  console.log('token', token);
  if (!token) {
    return next(new ErrorHandler('Vui lòng đăng nhập để xem', 401));
  }

  const decodedToken = await jwt.verify(token, process.env.SECRET_KEY_TOKEN);

  req.user = await User.findById(decodedToken.id);
  next();
});

const authorizeRoles = () => {
  return (req, res, next) => {
    if (!req.user.isAdmin) {
      next(new ErrorHandler(`Role ${req.user.role} is not allowed`));
    }
    next();
  };
};

module.exports = { isAuthenticatedUser, authorizeRoles };