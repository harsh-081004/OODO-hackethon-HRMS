const express = require('express');
const auth = require('../../middlewares/auth');
const reportController = require('../../controllers/report.controller');

const router = express.Router();

router
  .route('/payslip/:payrollId')
  .get(auth('getUsers'), reportController.downloadPayslipPdf);

module.exports = router;
