const httpStatus = require('http-status');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
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

module.exports = {
  loginUserWithEmailAndPassword,
  changePassword,
};
