require('dotenv').config();
const emailService = require('./src/services/email.service');
const mongoose = require('mongoose');

async function test() {
  console.log('Sending email...');
  try {
    await emailService.sendPasswordChangeOtpEmail('harshsuthar608@gmail.com', '123456', 'Harsh');
    console.log('Email sent successfully');
  } catch (err) {
    console.error('Email failed:', err);
  }
}

test();
