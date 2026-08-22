const { z } = require('zod');

const getAttendance = {
  query: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID').optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
};

const adminOverride = {
  params: z.object({
    employeeId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
  }),
  body: z.object({
    date: z.string(),
    status: z.enum(['Present', 'Absent', 'Half-day', 'Leave']),
  }),
};

module.exports = {
  getAttendance,
  adminOverride,
};
