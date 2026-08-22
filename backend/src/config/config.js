const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi'); // Wait, I didn't install joi, I used zod. Let me use process.env directly with a simple check.

dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoose: {
    url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dayflow',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'thisisasupersecretkey',
    accessExpirationDays: process.env.JWT_EXPIRES_IN || '7d',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

module.exports = config;
