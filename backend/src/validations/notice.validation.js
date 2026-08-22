const { z } = require('zod');

const createNotice = {
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    isActive: z.boolean().optional(),
  }),
};

const getNotices = {
  query: z.object({
    isActive: z.union([z.boolean(), z.string().transform(v => v === 'true')]).optional(),
  }),
};

const updateNotice = {
  params: z.object({
    noticeId: z.string(),
  }),
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    isActive: z.boolean().optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
};

const deleteNotice = {
  params: z.object({
    noticeId: z.string(),
  }),
};

module.exports = {
  createNotice,
  getNotices,
  updateNotice,
  deleteNotice,
};
