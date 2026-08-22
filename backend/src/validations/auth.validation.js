const { z } = require('zod');

const register = {
  body: z.object({
    companyName: z.string().min(1, 'Company Name is required'),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    phone: z.string().min(1, 'Phone is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    companyLogo: z.string().url('Invalid URL for logo').optional(),
  }),
};

const login = {
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
};

const changePassword = {
  body: z.object({
    oldPassword: z.string().min(1, 'Old password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  }),
};

module.exports = {
  register,
  login,
  changePassword,
};
