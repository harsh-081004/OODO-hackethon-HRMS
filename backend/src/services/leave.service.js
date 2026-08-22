const httpStatus = require('http-status');
const { Leave } = require('../models');
const ApiError = require('../utils/ApiError');

const applyLeave = async (userId, leaveBody) => {
  return Leave.create({ ...leaveBody, user: userId });
};

const queryLeaves = async (filter) => {
  return Leave.find(filter).populate('user', 'name employeeId').populate('approvedBy', 'name');
};

const updateLeaveStatus = async (leaveId, updateBody) => {
  const leave = await Leave.findById(leaveId);
  if (!leave) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Leave request not found');
  }
  Object.assign(leave, updateBody);
  await leave.save();
  return leave;
};

module.exports = {
  applyLeave,
  queryLeaves,
  updateLeaveStatus,
};
