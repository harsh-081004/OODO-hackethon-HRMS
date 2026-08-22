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
  
  // Assuming a standard 8-hour workday, calculate extra hours and determine status
  if (attendance.workHours >= 8) {
    attendance.status = 'Present';
    attendance.extraHours = parseFloat((attendance.workHours - 8).toFixed(2));
  } else if (attendance.workHours >= 4) {
    attendance.status = 'Half-day';
    attendance.extraHours = 0;
  } else {
    attendance.status = 'Absent';
    attendance.extraHours = 0;
  }

  await attendance.save();
  return attendance;
};

const queryAttendance = async (filter) => {
  return Attendance.find(filter).populate('user', 'name employeeId');
};

const adminOverride = async (employeeId, dateStr, status) => {
  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);

  let attendance = await Attendance.findOne({
    user: employeeId,
    date: { $gte: targetDate, $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000) },
  });

  if (attendance) {
    attendance.status = status;
    if (status === 'Present') {
      if (!attendance.checkIn) attendance.checkIn = new Date(targetDate.getTime() + 9 * 60 * 60 * 1000); // 9 AM
      if (!attendance.checkOut) attendance.checkOut = new Date(targetDate.getTime() + 18 * 60 * 60 * 1000); // 6 PM
      attendance.workHours = 9;
      attendance.extraHours = 1;
    } else {
      attendance.checkIn = null;
      attendance.checkOut = null;
      attendance.workHours = 0;
      attendance.extraHours = 0;
    }
    attendance.device = 'HR Manual Entry';
    await attendance.save();
  } else {
    attendance = await Attendance.create({
      user: employeeId,
      date: targetDate,
      checkIn: status === 'Present' ? new Date(targetDate.getTime() + 9 * 60 * 60 * 1000) : null,
      checkOut: status === 'Present' ? new Date(targetDate.getTime() + 18 * 60 * 60 * 1000) : null,
      status: status,
      workHours: status === 'Present' ? 9 : 0,
      extraHours: status === 'Present' ? 1 : 0,
      device: 'HR Manual Entry'
    });
  }

  // Populate user before returning so frontend gets name/loginId
  await attendance.populate('user', 'name employeeId');
  return attendance;
};

module.exports = {
  checkIn,
  checkOut,
  queryAttendance,
  adminOverride,
};
