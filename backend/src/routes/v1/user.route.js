const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('admin', 'hr'), validate(userValidation.createUser), userController.createUser)
  .get(auth('admin', 'hr'), userController.getUsers);

router
  .route('/me')
  .get(auth(), userController.getMyProfile)
  .patch(auth(), validate(userValidation.updateMyProfile), userController.updateMyProfile);

router
  .route('/:userId')
  .get(auth('admin', 'hr'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('admin', 'hr'), validate(userValidation.updateUser), userController.updateUser);

module.exports = router;
