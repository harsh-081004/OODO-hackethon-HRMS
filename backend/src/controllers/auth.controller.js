const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const ApiResponse = require('../utils/ApiResponse');

const register = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.companyLogo = req.file.path;
  }
  const user = await userService.createUser(req.body);
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);
  res.status(httpStatus.CREATED).send(new ApiResponse(httpStatus.CREATED, { user }, 'User registered. Please check your email to verify your account.'));
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send(new ApiResponse(httpStatus.OK, { user, tokens }, 'Login successful'));
});

const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  await authService.changePassword(req.user.id, oldPassword, newPassword);
  res.send(new ApiResponse(httpStatus.OK, null, 'Password changed successfully'));
});

const requestPasswordOtp = catchAsync(async (req, res) => {
  await authService.requestPasswordOtp(req.user.id);
  res.send(new ApiResponse(httpStatus.OK, null, 'OTP sent to your email successfully'));
});

const changePasswordWithOtp = catchAsync(async (req, res) => {
  const { otp, newPassword } = req.body;
  await authService.changePasswordWithOtp(req.user.id, otp, newPassword);
  res.send(new ApiResponse(httpStatus.OK, null, 'Password changed successfully using OTP'));
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.send(new ApiResponse(httpStatus.OK, null, 'Email verified successfully'));
});

module.exports = {
  register,
  login,
  changePassword,
  requestPasswordOtp,
  changePasswordWithOtp,
  verifyEmail,
};
