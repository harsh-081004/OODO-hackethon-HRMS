const httpStatus = require('http-status');
const { Attendance } = require('../models');
const ApiError = require('../utils/ApiError');

const checkIn = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingAttendance = await Attendance.findOne({
    user: userId,
    date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
  });

  if (existingAttendance) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already checked in today');
  }

  return Attendance.create({
    user: userId,
    date: new Date(),
    checkIn: new Date(),
    status: 'Present',
  });
};

const checkOut = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await Attendance.findOne({
    user: userId,
    date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
  });

  if (!attendance) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not checked in today');
  }
  if (attendance.checkOut) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already checked out today');
  }

  const checkOutTime = new Date();
  attendance.checkOut = checkOutTime;
  
  // Calculate work hours
  const diffInMs = checkOutTime.getTime() - attendance.checkIn.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  attendance.workHours = parseFloat(diffInHours.toFixed(2));
  
  // Assuming a standard 8-hour workday, calculate extra hours
  if (attendance.workHours > 8) {
    attendance.extraHours = parseFloat((attendance.workHours - 8).toFixed(2));
  } else {
    attendance.extraHours = 0;
  }

  await attendance.save();
  return attendance;
};

const queryAttendance = async (filter) => {
  return Attendance.find(filter).populate('user', 'name employeeId');
};

module.exports = {
  checkIn,
  checkOut,
  queryAttendance,
};
