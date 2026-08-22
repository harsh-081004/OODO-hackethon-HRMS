const httpStatus = require('http-status');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  if (!user.isEmailVerified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please verify your email to log in');
  }
  return user;
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await userService.getUserById(userId);
  if (!user || !(await user.isPasswordMatch(oldPassword))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password');
  }
  user.password = newPassword;
  await user.save();
  return user;
};

const verifyEmail = async (verifyEmailToken) => {
  try {
    const payload = jwt.verify(verifyEmailToken, config.jwt.secret);
    if (payload.type !== 'verifyEmail') {
      throw new Error('Invalid token type');
    }
    const user = await userService.getUserById(payload.sub);
    if (!user) {
      throw new Error();
    }
    user.isEmailVerified = true;
    await user.save();
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  changePassword,
  verifyEmail,
};
