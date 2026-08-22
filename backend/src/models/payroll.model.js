const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    payslipNumber: {
      type: String,
      unique: true,
      required: true,
    },
    month: {
      type: Number, // 1-12
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    basicSalary: { type: Number, required: true },
    hra: { type: Number, default: 0 },
    standardAllowance: { type: Number, default: 0 },
    performanceBonus: { type: Number, default: 0 },
    lta: { type: Number, default: 0 },
    fixedAllowance: { type: Number, default: 0 },
    pf: { type: Number, default: 0 },
    professionalTax: { type: Number, default: 0 },
    netSalary: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending',
    },
    paymentDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Payroll = mongoose.model('Payroll', payrollSchema);

module.exports = Payroll;
