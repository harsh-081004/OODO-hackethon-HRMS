const httpStatus = require('http-status');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { Otp } = require('../models');
const emailService = require('./email.service');

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

const requestPasswordOtp = async (userId) => {
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Remove existing OTP for this email if any
  await Otp.deleteMany({ email: user.email });

  // Save new OTP
  await Otp.create({ email: user.email, otp: otpCode });

  // Send Email
  await emailService.sendPasswordChangeOtpEmail(user.email, otpCode, user.firstName || user.name);
};

const changePasswordWithOtp = async (userId, otpCode, newPassword) => {
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const otpRecord = await Otp.findOne({ email: user.email, otp: otpCode });
  if (!otpRecord) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Clear OTP
  await Otp.deleteMany({ email: user.email });
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
  requestPasswordOtp,
  changePasswordWithOtp,
  verifyEmail,
};
