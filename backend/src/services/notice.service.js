const httpStatus = require('http-status');
const { Notice } = require('../models');
const ApiError = require('../utils/ApiError');

const createNotice = async (noticeBody) => {
  return Notice.create(noticeBody);
};

const queryNotices = async (filter) => {
  return Notice.find(filter).populate('author', 'name employeeId avatar').sort({ createdAt: -1 });
};

const getNoticeById = async (id) => {
  return Notice.findById(id).populate('author', 'name employeeId avatar');
};

const updateNoticeById = async (noticeId, updateBody) => {
  const notice = await getNoticeById(noticeId);
  if (!notice) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notice not found');
  }
  Object.assign(notice, updateBody);
  await notice.save();
  return notice;
};

const deleteNoticeById = async (noticeId) => {
  const notice = await getNoticeById(noticeId);
  if (!notice) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notice not found');
  }
  await notice.deleteOne();
  return notice;
};

module.exports = {
  createNotice,
  queryNotices,
  getNoticeById,
  updateNoticeById,
  deleteNoticeById,
};
