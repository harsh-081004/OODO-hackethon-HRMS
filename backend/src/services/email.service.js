const nodemailer = require('nodemailer');

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

const sendWelcomeEmail = async (to, password) => {
  const subject = 'Welcome to the HRMS System';
  const text = `Welcome! Your auto-generated password is: ${password}. Please login and change it.`;
  await sendEmail(to, subject, text);
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
  const verificationEmailUrl = `http://localhost:5173/verify-email?token=${token}`;
  
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

module.exports = {
  transport,
  sendEmail,
  sendWelcomeEmail,
  sendPayslipEmail,
  sendVerificationEmail,
};
