const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { payrollService } = require('../services');
const ApiResponse = require('../utils/ApiResponse');

const createPayroll = catchAsync(async (req, res) => {
  const b = req.body;
  const allowances = (b.hra || 0) + (b.standardAllowance || 0) + (b.performanceBonus || 0) + (b.lta || 0) + (b.fixedAllowance || 0);
  const deductions = (b.pf || 0) + (b.professionalTax || 0);
  const netSalary = b.basicSalary + allowances - deductions;
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
  const b = req.body;
  const hasSalaryUpdate = [
    'basicSalary', 'hra', 'standardAllowance', 'performanceBonus', 'lta', 'fixedAllowance', 'pf', 'professionalTax'
  ].some(field => b[field] !== undefined);

  if (hasSalaryUpdate) {
    const allowances = (payroll.hra || 0) + (payroll.standardAllowance || 0) + (payroll.performanceBonus || 0) + (payroll.lta || 0) + (payroll.fixedAllowance || 0);
    const deductions = (payroll.pf || 0) + (payroll.professionalTax || 0);
    payroll.netSalary = payroll.basicSalary + allowances - deductions;
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
