const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const { sendConfirmationEmail } = require('./utils/emailService');
const { body, validationResult } = require('express-validator');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
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
  body('userID').notEmpty().withMessage('User ID is required'),
  body('referrerName').notEmpty().withMessage('Referrer name is required'),
  body('referrerEmail')
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
    const { userID, referrerName, referrerEmail } = req.body;

    // Check for existing referral
    const existingReferral = await prisma.referral.findFirst({
      where: {
        AND: [
          { userID: userID },
          { referrerEmail: referrerEmail }
        ]
      }
    });

    let referral;
    if (!existingReferral) {
      referral = await prisma.referral.create({
        data: { userID, referrerName, referrerEmail },
      });
    } else {
      referral = existingReferral;
    }

    // Send confirmation email regardless of whether referral exists
    await sendConfirmationEmail(referrerEmail, referrerName);
    
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
        if (referrals.length === 0) return res.status(404).json({ error: 'No referrals found for this user' });
        res.json(referrals);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch referrals' });
    }
});
  
// API endpoint 4 : Update referral status [PUT]
  app.put('/api/referral/:id', async (req, res) => {
    try {
      const { status } = req.body;
      const referral = await prisma.referral.update({
        where: { id: parseInt(req.params.id) },
        data: { status },
      });
      res.json(referral);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update referral' });
    }
  });


const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await testConnection();
  console.log(`Server running on port ${PORT}`);
});
