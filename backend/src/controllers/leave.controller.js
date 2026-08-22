const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { leaveService } = require('../services');
const ApiResponse = require('../utils/ApiResponse');

const applyLeave = catchAsync(async (req, res) => {
  const leave = await leaveService.applyLeave(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(new ApiResponse(httpStatus.CREATED, leave, 'Leave applied successfully'));
});

const getMyLeaves = catchAsync(async (req, res) => {
  const filter = { user: req.user.id };
  const leaves = await leaveService.queryLeaves(filter);
  res.send(new ApiResponse(httpStatus.OK, leaves, 'Leaves fetched successfully'));
});

const getAllLeaves = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.userId) filter.user = req.query.userId;
  if (req.query.status) filter.status = req.query.status;
  
  const leaves = await leaveService.queryLeaves(filter);
  res.send(new ApiResponse(httpStatus.OK, leaves, 'Leaves fetched successfully'));
});

const approveRejectLeave = catchAsync(async (req, res) => {
  const updateBody = {
    status: req.body.status,
    adminComments: req.body.adminComments,
    approvedBy: req.user.id,
  };
  const leave = await leaveService.updateLeaveStatus(req.params.leaveId, updateBody);
  res.send(new ApiResponse(httpStatus.OK, leave, `Leave ${req.body.status.toLowerCase()} successfully`));
});

module.exports = {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  approveRejectLeave,
};
