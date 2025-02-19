# Accredian Backend Task - Referral System API

A Node.js backend service for managing referrals, built with Express.js and Prisma ORM.

## 🚀 Live Demo
Backend API: [https://accredian-backend-task-seven.vercel.app](https://accredian-backend-task-seven.vercel.app)

## ⚙️ Tech Stack
- Node.js
- Express.js
- Prisma ORM
- MySQL Database
- Nodemailer
- Express Validator
- CORS

## 🛠️ Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/TejasShirsath/Accredian-backend-task.git
cd Accredian-backend-task
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Variables**
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="mysql://username:password@host:port/database"
GMAIL_USER="your-email@gmail.com"
GMAIL_PASS="your-app-specific-password"
FRONTEND_URL="https://your-frontend-url.com"
BACKEND_URL="https://your-backend-url.com"
APP_NAME="Your App Name"
PORT=5000
```

4. **Database Setup**
```bash
npx prisma generate
npx prisma db push
```

5. **Start the server**
```bash
npm start
```

## 📌 API Endpoints

### 1. Create New Referral
- **POST** `/api/referral`
- Body:
```json
{
  "userID": "string",
  "referrerName": "string",
  "referreeName": "string",
  "referreeEmail": "string"
}
```

### 2. Get All Referrals
- **GET** `/api/referrals`

### 3. Get Referrals by User ID
- **GET** `/api/referral/user/:userID`

### 4. Accept Referral
- **GET** `/referral/accept?userID={userID}&email={email}`

### 5. Reject Referral
- **GET** `/referral/reject?userID={userID}&email={email}`

## 🔒 Data Model

```prisma
model Referral {
  id           Int      @id @default(autoincrement())
  userID       String
  refereeName  String
  refereeEmail String
  status       String   @default("PENDING")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

## 🌟 Features

- Email notifications for referrals
- Input validation
- CORS enabled
- Error handling
- Database connection testing
- Automatic database schema updates
- Support for development and production environments

## 🚀 Deployment

This project is configured for deployment on Vercel with:
- Node.js 18.x runtime
- Automatic Prisma client generation
- Database migrations handling

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

Tejas Shirsath
- GitHub: [@TejasShirsath](https://github.com/TejasShirsath)
