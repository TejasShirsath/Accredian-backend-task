const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const { sendConfirmationEmail } = require('./utils/emailService');

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

// Create new referral
app.post('/api/referral', async (req, res) => {
  try {
    const { userID, referrerName, referrerEmail } = req.body;

    // Validation
    if (!userID || !referrerName || !referrerEmail) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(referrerEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const referral = await prisma.referral.create({
      data: { userID, referrerName, referrerEmail },
    });

    // Send confirmation email
    await sendConfirmationEmail(referrerEmail, referrerName);

    res.status(201).json(referral);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create referral' });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await testConnection();
  console.log(`Server running on port ${PORT}`);
});
