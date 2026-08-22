const { z } = require('zod');

const getAttendance = {
  query: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID').optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
};

module.exports = {
  getAttendance,
};
