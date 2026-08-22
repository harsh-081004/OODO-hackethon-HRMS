const httpStatus = require('http-status');
const PDFDocument = require('pdfkit');
const { Payroll } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const downloadPayslipPdf = catchAsync(async (req, res) => {
  const payroll = await Payroll.findById(req.params.payrollId).populate('user');
  
  if (!payroll) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payroll record not found');
  }

  // Set response headers for PDF download
  res.setHeader('Content-disposition', `attachment; filename=payslip-${payroll.payslipNumber}.pdf`);
  res.setHeader('Content-type', 'application/pdf');

  // Initialize PDF
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  const user = payroll.user;

  // Header
  doc.fontSize(20).text('Salary Slip', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Payslip No: ${payroll.payslipNumber}`);
  doc.fontSize(12).text(`Month/Year: ${payroll.month}/${payroll.year}`);
  doc.moveDown();

  // Employee Details
  doc.fontSize(14).text('Employee Details', { underline: true });
  doc.fontSize(12).text(`Name: ${user.name}`);
  doc.text(`Employee ID: ${user.employeeId}`);
  if (user.privateInfo && user.privateInfo.bankDetails) {
    const bank = user.privateInfo.bankDetails;
    doc.text(`Bank A/C: ${bank.accountNumber || 'N/A'}`);
    doc.text(`PAN No: ${bank.panNo || 'N/A'}`);
  }
  doc.moveDown();

  // Salary Details
  doc.fontSize(14).text('Salary Breakdown', { underline: true });
  doc.moveDown();

  const startY = doc.y;
  
  // Left Column - Earnings
  doc.text('Earnings', 50, startY, { underline: true });
  doc.text(`Basic Salary: ${payroll.basicSalary}`, 50, startY + 20);
  doc.text(`HRA: ${payroll.hra}`, 50, startY + 40);
  doc.text(`Standard Allowance: ${payroll.standardAllowance}`, 50, startY + 60);
  doc.text(`Performance Bonus: ${payroll.performanceBonus}`, 50, startY + 80);
  doc.text(`LTA: ${payroll.lta}`, 50, startY + 100);
  doc.text(`Fixed Allowance: ${payroll.fixedAllowance}`, 50, startY + 120);

  // Right Column - Deductions
  doc.text('Deductions', 300, startY, { underline: true });
  doc.text(`PF: ${payroll.pf}`, 300, startY + 20);
  doc.text(`Professional Tax: ${payroll.professionalTax}`, 300, startY + 40);

  doc.moveDown(8);
  doc.fontSize(14).text(`Net Salary: ${payroll.netSalary}`, 50, doc.y, { bold: true });

  doc.end();
});

module.exports = {
  downloadPayslipPdf,
};
