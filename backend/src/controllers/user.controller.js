const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const getUsers = catchAsync(async (req, res) => {
  const filter = {};
  if (req.user.role === 'admin' || req.user.role === 'hr') {
    filter.companyName = req.user.companyName;
  }
  const result = await userService.queryUsers(filter);
  res.send(new ApiResponse(httpStatus.OK, result, 'Users fetched successfully'));
});

const createUser = catchAsync(async (req, res) => {
  const { user, generatedPassword } = await userService.createEmployee(req.body, req.user);
  res.status(httpStatus.CREATED).send(
    new ApiResponse(httpStatus.CREATED, { user, generatedPassword }, 'Employee created successfully. Password auto-generated.')
  );
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(new ApiResponse(httpStatus.OK, user, 'User fetched successfully'));
});

const getMyProfile = catchAsync(async (req, res) => {
  const user = req.user.toObject();
  if (req.user.role === 'employee') {
    delete user.salaryStructure;
  }
  res.send(new ApiResponse(httpStatus.OK, user, 'Profile fetched successfully'));
});

const updateMyProfile = catchAsync(async (req, res) => {
  // Employees can only update limited fields
  const allowedUpdates = {};
  if (req.body.profile) {
    allowedUpdates.profile = {
      ...req.user.profile,
      mobile: req.body.profile.mobile || req.user.profile?.mobile,
      address: req.body.profile.address || req.user.profile?.address,
      profilePicture: req.body.profile.profilePicture || req.user.profile?.profilePicture,
    };
  }
  const user = await userService.updateUserById(req.user.id, allowedUpdates);
  res.send(new ApiResponse(httpStatus.OK, user, 'Profile updated successfully'));
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(new ApiResponse(httpStatus.OK, user, 'User updated successfully'));
});

module.exports = {
  getUsers,
  createUser,
  getUser,
  getMyProfile,
  updateMyProfile,
  updateUser,
};
