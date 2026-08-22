const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');
const config = require('../config/config');

const auth = (...requiredRoles) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, config.jwt.secret);

    const user = await User.findById(payload.sub);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }

    req.user = user;

    if (requiredRoles.length) {
      if (!requiredRoles.includes(user.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
    }

    next();
  } catch (err) {
    next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
};

module.exports = auth;
