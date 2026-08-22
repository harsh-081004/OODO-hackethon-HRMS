const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: expires,
    type,
  };
  return jwt.sign(payload, secret);
};

const generateAuthTokens = async (user) => {
  // Convert 7d to seconds: 7 * 24 * 60 * 60 = 604800
  const accessTokenExpires = Math.floor(Date.now() / 1000) + 604800; // 7 days
  const accessToken = generateToken(user.id, accessTokenExpires, 'access');

  return {
    access: {
      token: accessToken,
      expires: new Date(accessTokenExpires * 1000),
    },
  };
};

module.exports = {
  generateToken,
  generateAuthTokens,
};
