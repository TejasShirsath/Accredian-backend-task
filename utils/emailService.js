const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendConfirmationEmail = async (referrerEmail, referrerName) => {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: referrerEmail,
      subject: 'Referral Confirmation',
      html: `
        <h1>Thank you for your referral, ${referrerName}!</h1>
        <p>We have received your referral and will process it shortly.</p>
      `,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

module.exports = { sendConfirmationEmail };
