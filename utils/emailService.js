const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendConfirmationEmail = async (email, refereeName, referrerName, userID) => {
  // Change URLs to use port 5000 directly
  const acceptUrl = `http://localhost:5000/referral/accept?userID=${encodeURIComponent(userID)}&email=${encodeURIComponent(email)}`;
  const rejectUrl = `http://localhost:5000/referral/reject?userID=${encodeURIComponent(userID)}&email=${encodeURIComponent(email)}`;
  

  const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
        .content { padding: 20px 0; }
        .benefits { margin: 20px 0; }
        .benefit-item { margin: 10px 0; padding-left: 25px; position: relative; }
        .benefit-item:before { content: "✅"; position: absolute; left: 0; }
        .button-container { text-align: center; margin: 30px 0; }
        .button {
          display: inline-block;
          padding: 12px 24px;
          margin: 0 10px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          color: white !important;
          text-align: center;
        }
        .accept {
          background-color: #28a745;
          border: 2px solid #28a745;
        }
        .accept:hover {
          background-color: #218838;
        }
        .reject {
          background-color: #dc3545;
          border: 2px solid #dc3545;
        }
        .reject:hover {
          background-color: #c82333;
        }
        .footer { text-align: center; margin-top: 30px; color: #666; }
        .emoji { font-size: 1.2em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 ${referrerName} Invited You!</h1>
          <p>Don't Miss This Exclusive Opportunity!</p>
        </div>
        
        <div class="content">
          <p>Hey ${refereeName},</p>
          <p>I hope you're doing great! 🚀</p>
          
          <p>I wanted to personally reach out because <strong>${referrerName}</strong> thought you'd be a perfect fit for this amazing opportunity. They've referred you to Accredian, where you can unlock exclusive rewards and benefits!</p>
          
          <div class="benefits">
            <div class="benefit-item">Access to premium features and exclusive content</div>
            <div class="benefit-item">Special member-only discounts and offers</div>
            <div class="benefit-item">Early access to new features and updates</div>
          </div>
          
          <p>And guess what? ${referrerName} might even get a bonus when you join. It's a win-win! 🎁</p>
          
          <p><strong>Don't miss out – this referral is exclusive! 💡</strong></p>
          
          <div class="button-container">
            <a href="${acceptUrl}" 
               class="button accept">
               ✅ Accept Invitation
            </a>
            
            <a href="${rejectUrl}" 
               class="button reject">
               ❌ Decline
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p>Cheers,<br>Accredian Team (TESTING)</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: `🎉 ${referrerName} Invited You – Don't Miss This Exclusive Opportunity!`,
      html: emailTemplate,
    });
    console.log('Referral email sent successfully');
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

module.exports = { sendConfirmationEmail };
