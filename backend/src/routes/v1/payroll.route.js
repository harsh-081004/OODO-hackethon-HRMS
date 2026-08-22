const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const payrollValidation = require('../../validations/payroll.validation');
const payrollController = require('../../controllers/payroll.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('admin', 'hr'), validate(payrollValidation.createPayroll), payrollController.createPayroll)
  .get(auth('admin', 'hr'), validate(payrollValidation.getPayrolls), payrollController.getAllPayrolls);

router
  .route('/me')
  .get(auth(), payrollController.getMyPayrolls);

router
  .route('/:payrollId')
  .patch(auth('admin', 'hr'), validate(payrollValidation.updatePayroll), payrollController.updatePayroll);

module.exports = router;
