const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { payrollService } = require('../services');
const ApiResponse = require('../utils/ApiResponse');

const createPayroll = catchAsync(async (req, res) => {
  const netSalary = req.body.basicSalary + (req.body.allowances || 0) - (req.body.deductions || 0);
  const payrollBody = { ...req.body, netSalary };
  const payroll = await payrollService.createPayroll(payrollBody);
  res.status(httpStatus.CREATED).send(new ApiResponse(httpStatus.CREATED, payroll, 'Payroll record created successfully'));
});

const getMyPayrolls = catchAsync(async (req, res) => {
  const filter = { user: req.user.id };
  const payrolls = await payrollService.queryPayrolls(filter);
  res.send(new ApiResponse(httpStatus.OK, payrolls, 'Payroll data fetched successfully'));
});

const getAllPayrolls = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.userId) filter.user = req.query.userId;
  if (req.query.month) filter.month = req.query.month;
  if (req.query.year) filter.year = req.query.year;

  const payrolls = await payrollService.queryPayrolls(filter);
  res.send(new ApiResponse(httpStatus.OK, payrolls, 'Payroll records fetched successfully'));
});

const updatePayroll = catchAsync(async (req, res) => {
  const payroll = await payrollService.updatePayroll(req.params.payrollId, req.body);
  if (req.body.basicSalary || req.body.allowances !== undefined || req.body.deductions !== undefined) {
    payroll.netSalary = payroll.basicSalary + payroll.allowances - payroll.deductions;
    await payroll.save();
  }
  res.send(new ApiResponse(httpStatus.OK, payroll, 'Payroll record updated successfully'));
});

module.exports = {
  createPayroll,
  getMyPayrolls,
  getAllPayrolls,
  updatePayroll,
};
