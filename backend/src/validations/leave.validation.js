const { z } = require('zod');

const applyLeave = {
  body: z.object({
    leaveType: z.enum(['Paid', 'Sick', 'Unpaid']),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid start date' }),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid end date' }),
    remarks: z.string().optional(),
  }),
};

const getLeaves = {
  query: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID').optional(),
    status: z.enum(['Pending', 'Approved', 'Rejected']).optional(),
  }),
};

const approveRejectLeave = {
  params: z.object({
    leaveId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid leave ID'),
  }),
  body: z.object({
    status: z.enum(['Approved', 'Rejected']),
    adminComments: z.string().optional(),
  }),
};

module.exports = {
  applyLeave,
  getLeaves,
  approveRejectLeave,
};
