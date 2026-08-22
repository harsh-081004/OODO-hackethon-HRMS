const httpStatus = require('http-status');
const { Payroll } = require('../models');
const ApiError = require('../utils/ApiError');

const createPayroll = async (payrollBody) => {
  return Payroll.create(payrollBody);
};

const queryPayrolls = async (filter) => {
  return Payroll.find(filter).populate('user', 'name employeeId');
};

const updatePayroll = async (payrollId, updateBody) => {
  const payroll = await Payroll.findById(payrollId);
  if (!payroll) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payroll record not found');
  }
  Object.assign(payroll, updateBody);
  await payroll.save();
  return payroll;
};

module.exports = {
  createPayroll,
  queryPayrolls,
  updatePayroll,
};
