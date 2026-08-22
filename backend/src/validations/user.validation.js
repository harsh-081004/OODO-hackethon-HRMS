const { z } = require('zod');

const getUser = {
  params: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
  }),
};

const createUser = {
  body: z.object({
    email: z.string().email(),
    name: z.string().min(1),
    role: z.enum(['employee', 'admin', 'hr']).optional(),
    profile: z.object({
      mobile: z.string().optional(),
      department: z.string().optional(),
    }).optional(),
    privateInfo: z.object({
      dateOfJoining: z.string().optional(),
    }).optional(),
    salaryStructure: z.object({
      basic: z.number().optional(),
    }).optional(),
  }),
};

const updateUser = {
  params: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
  }),
  body: z.object({
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    name: z.string().optional(),
    role: z.enum(['employee', 'admin', 'hr']).optional(),
    profile: z.object({
      mobile: z.string().optional(),
      department: z.string().optional(),
      address: z.string().optional(),
      profilePicture: z.string().optional(),
    }).optional(),
    salaryStructure: z.object({
      basic: z.number().optional(),
      allowances: z.number().optional(),
      deductions: z.number().optional(),
    }).optional(),
  }),
};

const updateMyProfile = {
  body: z.object({
    profile: z.object({
      mobile: z.string().optional(),
      address: z.string().optional(),
      profilePicture: z.string().optional(),
    }),
  }),
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  updateMyProfile,
};
