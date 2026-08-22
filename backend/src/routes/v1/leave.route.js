const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const leaveValidation = require('../../validations/leave.validation');
const leaveController = require('../../controllers/leave.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(leaveValidation.applyLeave), leaveController.applyLeave)
  .get(auth('admin', 'hr'), validate(leaveValidation.getLeaves), leaveController.getAllLeaves);

router
  .route('/me')
  .get(auth(), leaveController.getMyLeaves);

router
  .route('/:leaveId/approve')
  .patch(auth('admin', 'hr'), validate(leaveValidation.approveRejectLeave), leaveController.approveRejectLeave);

module.exports = router;
