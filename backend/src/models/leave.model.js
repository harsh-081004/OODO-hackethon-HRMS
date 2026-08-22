const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    leaveType: {
      type: String,
      enum: ['Paid', 'Sick', 'Unpaid'],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    allocationDays: {
      type: Number,
      required: true,
    },
    remarks: {
      type: String,
    },
    attachment: {
      type: String, // URL to certificate
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    approvedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    adminComments: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Leave = mongoose.model('Leave', leaveSchema);

module.exports = Leave;
