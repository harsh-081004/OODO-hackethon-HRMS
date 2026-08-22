const express = require('express');
const router = express.Router();

const authRoute = require('./v1/auth.route');
const userRoute = require('./v1/user.route');
const attendanceRoute = require('./v1/attendance.route');
const leaveRoute = require('./v1/leave.route');
const payrollRoute = require('./v1/payroll.route');
const reportRoute = require('./v1/report.route');

router.get('/health', (req, res) => {
  res.status(200).send('OK');
});

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/attendance', attendanceRoute);
router.use('/leaves', leaveRoute);
router.use('/payrolls', payrollRoute);
router.use('/reports', reportRoute);

module.exports = router;
