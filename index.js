require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const { sendConfirmationEmail } = require('./utils/emailService');
const { body, validationResult } = require('express-validator');

const prisma = new PrismaClient();
const app = express();

app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.BACKEND_URL],
  credentials: true
}));
app.use(express.json());

// Test database connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

const referralValidation = [
  body('referrerName').notEmpty().withMessage('Referrer name is required'),
  body('userID').notEmpty().withMessage('User ID is required'),
  body('referreeName').notEmpty().withMessage('Referee name is required'),
  body('referreeEmail')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
];

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// API endpoint 1 : Create new referral [POST]
app.post('/api/referral', referralValidation, validate, async (req, res) => {
  try {
    const { userID, referrerName, referreeName, referreeEmail } = req.body;

    // Check for existing referral
    const existingReferral = await prisma.referral.findFirst({
      where: {
        AND: [
          { userID: userID },
          { refereeEmail: referreeEmail }
        ]
      }
    });

    let referral;
    if (!existingReferral) {
      referral = await prisma.referral.create({
        data: { 
          userID,
          refereeName: referreeName, 
          refereeEmail: referreeEmail 
        },
      });
    } else {
      referral = existingReferral;
    }

    // Send confirmation email with both referrerName and userID
    await sendConfirmationEmail(referreeEmail, referreeName, referrerName, userID);
    
    res.status(201).json(referral);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process referral' });
  }
});

// API endpoint 2 : Get all referrals [GET] 
app.get('/api/referrals', async (req, res) => {
    try {
      const referrals = await prisma.referral.findMany();
      res.json(referrals);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch referrals' });
    }
  });
  
// API endpoint 3 : Get referrals by userID [GET]
app.get('/api/referral/user/:userID', async (req, res) => {
    try {
        const referrals = await prisma.referral.findMany({
            where: { userID: req.params.userID },
        });
        
        res.json({
            success: true,
            data: referrals,
            message: referrals.length === 0 ? "No referrals found for this user" : "Referrals retrieved successfully",
            count: referrals.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch referrals',
            error: error.message
        });
    }
});

// API endpoint 4: Handle referral acceptance
app.get('/referral/accept', async (req, res) => {
  try {
    const { userID, email } = req.query;
    
    console.log('Accepting referral:', { userID, email }); // Add logging

    const referral = await prisma.referral.updateMany({
      where: {
        AND: [
          { userID: decodeURIComponent(userID) },
          { refereeEmail: decodeURIComponent(email) }
        ]
      },
      data: { status: 'ACCEPTED' },
    });

    console.log('Update result:', referral); // Add logging

    if (referral.count === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Referral not found' 
      });
    }

    // Send HTML response with redirect script
    res.send(`
      <html>
        <body style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial;">
          <div style="text-align: center; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h1 style="color: #28a745;">✅ Referral Accepted!</h1>
            <p>Thank you for accepting the referral. You can close this window now.</p>
            <script>
              console.log('Referral accepted successfully');
              setTimeout(() => {
                window.location.href = '${process.env.FRONTEND_URL}/referrals';
              }, 2000);
            </script>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error accepting referral:', error); // Add logging
    res.status(500).json({ 
      success: false, 
      error: 'Failed to accept referral' 
    });
  }
});

// API endpoint 5: Handle referral rejection
app.get('/referral/reject', async (req, res) => {
  try {
    const { userID, email } = req.query;
    
    const referral = await prisma.referral.updateMany({
      where: {
        AND: [
          { userID: decodeURIComponent(userID) },
          { refereeEmail: decodeURIComponent(email) }
        ]
      },
      data: { status: 'REJECTED' },
    });

    if (referral.count === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Referral not found' 
      });
    }

    // Redirect to a rejection confirmation page or show message
    res.send(`
      <html>
        <body style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial;">
          <div style="text-align: center; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h1 style="color: #dc3545;">❌ Referral Declined</h1>
            <p>You have declined the referral. You can close this window now.</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to reject referral' 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await testConnection();
  console.log(`Server running on port ${PORT}`);
});
