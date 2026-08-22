const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');
const { upload } = require('../../config/cloudinary');

const router = express.Router();

router.post('/register', upload.single('companyLogo'), validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/change-password', auth(), validate(authValidation.changePassword), authController.changePassword);
router.post('/request-password-otp', auth(), authController.requestPasswordOtp);
router.post('/change-password-otp', auth(), validate(authValidation.changePasswordWithOtp), authController.changePasswordWithOtp);
router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

module.exports = router;
