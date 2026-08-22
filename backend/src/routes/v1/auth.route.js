const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');
const { upload } = require('../../config/cloudinary');

const router = express.Router();

router.post('/register', upload.single('companyLogo'), validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.patch('/change-password', auth(), validate(authValidation.changePassword), authController.changePassword);
router.get('/verify-email', authController.verifyEmail);

module.exports = router;
