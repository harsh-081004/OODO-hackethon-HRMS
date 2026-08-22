const httpStatus = require('http-status');
const { Payroll } = require('../models');
const ApiError = require('../utils/ApiError');

const createPayroll = async (payrollBody) => {
  const currentYear = payrollBody.year || new Date().getFullYear();
  const monthStr = String(payrollBody.month).padStart(2, '0');
  
  const prefix = `PS-${currentYear}${monthStr}-`;
  const lastPayroll = await Payroll.findOne({ payslipNumber: new RegExp(`^${prefix}`) }).sort({ payslipNumber: -1 });

  let sequence = 1;
  if (lastPayroll && lastPayroll.payslipNumber) {
    const lastSeq = parseInt(lastPayroll.payslipNumber.split('-')[2], 10);
    if (!isNaN(lastSeq)) {
      sequence = lastSeq + 1;
    }
  }

  payrollBody.payslipNumber = `${prefix}${String(sequence).padStart(4, '0')}`;
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
