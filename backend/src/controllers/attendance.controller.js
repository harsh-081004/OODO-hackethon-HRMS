const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { attendanceService } = require('../services');
const ApiResponse = require('../utils/ApiResponse');

const checkIn = catchAsync(async (req, res) => {
  const attendance = await attendanceService.checkIn(req.user.id);
  res.status(httpStatus.CREATED).send(new ApiResponse(httpStatus.CREATED, attendance, 'Checked in successfully'));
});

const checkOut = catchAsync(async (req, res) => {
  const attendance = await attendanceService.checkOut(req.user.id);
  res.send(new ApiResponse(httpStatus.OK, attendance, 'Checked out successfully'));
});

const getMyAttendance = catchAsync(async (req, res) => {
  const filter = { user: req.user.id };
  const result = await attendanceService.queryAttendance(filter);
  res.send(new ApiResponse(httpStatus.OK, result, 'Attendance fetched successfully'));
});

const getAllAttendance = catchAsync(async (req, res) => {
  const filter = {}; // Extract date range or user query if needed
  if (req.query.userId) {
    filter.user = req.query.userId;
  }
  const result = await attendanceService.queryAttendance(filter);
  res.send(new ApiResponse(httpStatus.OK, result, 'Attendance fetched successfully'));
});

const adminOverride = catchAsync(async (req, res) => {
  const { employeeId } = req.params;
  const { date, status } = req.body;
  const attendance = await attendanceService.adminOverride(employeeId, date, status);
  res.send(new ApiResponse(httpStatus.OK, attendance, 'Attendance overridden successfully'));
});

module.exports = {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
  adminOverride,
};
