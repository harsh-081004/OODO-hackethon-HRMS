const { z } = require('zod');

const createPayroll = {
  body: z.object({
    user: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
    month: z.number().min(1).max(12),
    year: z.number().min(2000),
    basicSalary: z.number().min(0),
    allowances: z.number().min(0).optional(),
    deductions: z.number().min(0).optional(),
  }),
};

const getPayrolls = {
  query: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID').optional(),
    month: z.number().min(1).max(12).optional(),
    year: z.number().min(2000).optional(),
  }),
};

const updatePayroll = {
  params: z.object({
    payrollId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid payroll ID'),
  }),
  body: z.object({
    basicSalary: z.number().min(0).optional(),
    allowances: z.number().min(0).optional(),
    deductions: z.number().min(0).optional(),
    status: z.enum(['Pending', 'Paid']).optional(),
  }),
};

module.exports = {
  createPayroll,
  getPayrolls,
  updatePayroll,
};
