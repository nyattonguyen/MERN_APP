require('dotenv').config();
const catchAsyncErrors = require('./catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {

  const { token } = req.cookies;

  console.log('token', token);
  if (!token) {
    return next(new ErrorHandler('Vui lòng đăng nhập để booking', 401));
  }

  const decodedToken = await jwt.verify(token, process.env.SECRET_KEY_TOKEN);

  const user = await User.findById(decodedToken.id);  

  if(!user) return res.send('Error')

  req.user = user
  next();
});

const authorizeRoles = (...isAdmin) => {
  return (req, res, next) => {
    if (!isAdmin) {
      next(new ErrorHandler(`Role ${req.user.isAdmin} is not allowed`));
    }
    next();
  };
};

module.exports = { isAuthenticatedUser, authorizeRoles };