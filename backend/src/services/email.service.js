const nodemailer = require('nodemailer');
const config = require('../config/config');

let transport;
if (process.env.SMTP_HOST) {
  transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT == 465,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
} else {
  // Fallback to console logging if no SMTP configured
  transport = nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true
  });
}

const sendEmail = async (to, subject, text, html, attachments = []) => {
  const from = process.env.EMAIL_FROM || 'hrms-noreply@company.com';
  const msg = { from, to, subject, text, html, attachments };
  
  if (!process.env.SMTP_HOST) {
    console.log('================= MOCK EMAIL =================');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Text: ${text}`);
    console.log(`Attachments: ${attachments.length}`);
    console.log('==============================================');
    return;
  }
  
  // Real transport logic using configured SMTP
  try {
    await transport.sendMail(msg);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
};

const sendWelcomeEmail = async (to, password, employeeName = 'Employee') => {
  const subject = 'Welcome to Case Point HRMS';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaeb; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #714B67; margin: 0;">Case Point HRMS</h2>
      </div>
      <h3 style="color: #333;">Welcome aboard, ${employeeName}!</h3>
      <p style="color: #555; line-height: 1.6;">
        Your employee profile has been successfully created in the Case Point HRMS system. You can now log in to your dashboard to view your profile, manage your attendance, and access your payroll information.
      </p>
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 25px 0;">
        <p style="margin: 0 0 10px 0; color: #555;"><strong>Your Login Credentials:</strong></p>
        <p style="margin: 0 0 5px 0; color: #555;"><strong>Email:</strong> ${to}</p>
        <p style="margin: 0; color: #555;"><strong>Temporary Password:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; color: #714B67;">${password}</code></p>
      </div>
      <p style="color: #555; line-height: 1.6; font-size: 14px;">
        <em>Note: Please change your temporary password immediately upon your first login for security purposes.</em>
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${config.frontendUrl}/login" style="background-color: #714B67; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Login to Dashboard
        </a>
      </div>
      <p style="color: #777; font-size: 12px; line-height: 1.5; margin-top: 30px; border-top: 1px solid #eaeaeb; padding-top: 15px;">
        If you have any questions or need assistance, please contact the HR Administration team.
      </p>
    </div>
  `;
  
  const text = `Welcome to Case Point HRMS, ${employeeName}!\n\nYour account has been created. Your temporary password is: ${password}\n\nPlease login and change it immediately.`;
  
  await sendEmail(to, subject, text, html);
};

const sendPayslipEmail = async (to, payslipNumber, pdfBuffer) => {
  const subject = `Your Payslip: ${payslipNumber}`;
  const text = `Please find your payslip ${payslipNumber} attached as a PDF.`;
  const attachments = [
    {
      filename: `${payslipNumber}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf',
    }
  ];
  await sendEmail(to, subject, text, null, attachments);
};

const sendVerificationEmail = async (to, token) => {
  const subject = 'Verify your Email - Case Point HRMS';
  const verificationEmailUrl = `${config.frontendUrl}/verify-email?token=${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaeb; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #714B67; margin: 0;">Case Point HRMS</h2>
      </div>
      <h3 style="color: #333;">Welcome aboard!</h3>
      <p style="color: #555; line-height: 1.6;">
        You're almost there. Please verify your email address to activate your Case Point HRMS account.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationEmailUrl}" style="background-color: #714B67; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      <p style="color: #777; font-size: 12px; line-height: 1.5; margin-top: 30px; border-top: 1px solid #eaeaeb; padding-top: 15px;">
        If you didn't request this, you can safely ignore this email.<br>
        Alternatively, you can copy and paste this link into your browser:<br>
        <a href="${verificationEmailUrl}" style="color: #714B67;">${verificationEmailUrl}</a>
      </p>
    </div>
  `;
  
  const text = `Dear user,\nTo verify your email, click on this link: ${verificationEmailUrl}\nIf you did not create an account, then ignore this email.`;
  
  await sendEmail(to, subject, text, html);
};

const sendPasswordChangeOtpEmail = async (to, otp, employeeName = 'Employee') => {
  const subject = 'Your Password Change OTP - Case Point HRMS';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaeb; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #714B67; margin: 0;">Case Point HRMS</h2>
      </div>
      <h3 style="color: #333;">Security Verification</h3>
      <p style="color: #555; line-height: 1.6;">
        Hi ${employeeName},<br/><br/>
        We received a request to change the password associated with your account. Please use the verification code below to complete the process.
      </p>
      <div style="background-color: #f8f9fa; padding: 25px; border-radius: 6px; margin: 25px 0; text-align: center; border: 1px dashed #714B67;">
        <p style="margin: 0 0 10px 0; color: #555; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;"><strong>Your 6-Digit OTP</strong></p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #714B67; background: #fff; padding: 10px; border-radius: 4px; display: inline-block;">
          ${otp}
        </div>
      </div>
      <p style="color: #555; line-height: 1.6; font-size: 14px;">
        This code is valid for <strong>10 minutes</strong>. If you did not request a password change, please ignore this email or contact HR Administration immediately.
      </p>
      <p style="color: #777; font-size: 12px; line-height: 1.5; margin-top: 30px; border-top: 1px solid #eaeaeb; padding-top: 15px;">
        For your security, never share this OTP with anyone, including Case Point support staff.
      </p>
    </div>
  `;
  
  const text = `Dear ${employeeName},\n\nYour OTP for changing your Case Point HRMS password is: ${otp}\n\nThis code is valid for 10 minutes.\n\nIf you did not request this, please ignore this email.`;
  
  await sendEmail(to, subject, text, html);
};

module.exports = {
  transport,
  sendEmail,
  sendWelcomeEmail,
  sendPayslipEmail,
  sendVerificationEmail,
  sendPasswordChangeOtpEmail,
};
