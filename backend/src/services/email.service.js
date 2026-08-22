const nodemailer = require('nodemailer');

// For development/demonstration, we can use a mock transporter or ethereal email,
// but for now, we'll log the email content to the console since credentials aren't set.
const transport = nodemailer.createTransport({
  streamTransport: true,
  newline: 'unix',
  buffer: true
});

const sendEmail = async (to, subject, text, html, attachments = []) => {
  const msg = { from: 'hrms-noreply@company.com', to, subject, text, html, attachments };
  
  if (process.env.NODE_ENV !== 'production' && !process.env.SMTP_HOST) {
    console.log('================= MOCK EMAIL =================');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Text: ${text}`);
    console.log(`Attachments: ${attachments.length}`);
    console.log('==============================================');
    return;
  }
  
  // Real transport logic would go here when SMTP config is set
  // await transport.sendMail(msg);
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
  const subject = 'Verify your Email';
  // In a real app, replace localhost with your actual frontend URL
  const verificationEmailUrl = `http://localhost:3000/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendWelcomeEmail,
  sendPayslipEmail,
  sendVerificationEmail,
};
