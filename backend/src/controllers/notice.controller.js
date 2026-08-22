const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { noticeService } = require('../services');

const createNotice = catchAsync(async (req, res) => {
  const notice = await noticeService.createNotice({ ...req.body, author: req.user._id });
  // Populate author before returning
  await notice.populate('author', 'name employeeId avatar');
  res.status(httpStatus.CREATED).send({ data: notice, message: 'Notice created successfully' });
});

const getNotices = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }
  const notices = await noticeService.queryNotices(filter);
  res.send({ data: notices, message: 'Notices fetched successfully' });
});

const updateNotice = catchAsync(async (req, res) => {
  const notice = await noticeService.updateNoticeById(req.params.noticeId, req.body);
  res.send({ data: notice, message: 'Notice updated successfully' });
});

const deleteNotice = catchAsync(async (req, res) => {
  await noticeService.deleteNoticeById(req.params.noticeId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createNotice,
  getNotices,
  updateNotice,
  deleteNotice,
};
