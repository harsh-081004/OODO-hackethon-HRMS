const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const noticeValidation = require('../../validations/notice.validation');
const noticeController = require('../../controllers/notice.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('admin'), validate(noticeValidation.createNotice), noticeController.createNotice)
  .get(auth(), validate(noticeValidation.getNotices), noticeController.getNotices);

router
  .route('/:noticeId')
  .patch(auth('admin'), validate(noticeValidation.updateNotice), noticeController.updateNotice)
  .delete(auth('admin'), validate(noticeValidation.deleteNotice), noticeController.deleteNotice);

module.exports = router;
