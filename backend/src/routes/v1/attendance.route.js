const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const attendanceValidation = require('../../validations/attendance.validation');
const attendanceController = require('../../controllers/attendance.controller');

const router = express.Router();

router
  .route('/')
  .get(auth('admin', 'hr'), validate(attendanceValidation.getAttendance), attendanceController.getAllAttendance);

router
  .route('/me')
  .get(auth(), attendanceController.getMyAttendance);

router
  .route('/check-in')
  .post(auth(), attendanceController.checkIn);

router
  .route('/check-out')
  .post(auth(), attendanceController.checkOut);

router
  .route('/:employeeId/override')
  .patch(auth('admin', 'hr'), validate(attendanceValidation.adminOverride), attendanceController.adminOverride);

module.exports = router;
