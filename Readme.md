# AuthHub

AuthHub is a full-stack authentication project built to practice and master modern user authentication flows in a real-world MERN-style application. The backend is built with Node.js, Express.js, and MongoDB, while the frontend is built with Next.js. The project focuses on secure login systems, token-based authentication, email verification, forgot-password flows, OTP verification, and session handling.

## Features

* User registration
* Login and logout
* JWT access token and refresh token flow
* Protected routes
* Email verification
* Forgot password and reset password
* OTP-based verification
* Session management
* Role-based access control
* Profile management
* Password hashing with `bcryptjs`
* Secure token handling with Node.js `crypto`
* Nodemailer integration for sending emails
* Rate limiting and basic security middleware

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* crypto
* Nodemailer
* cookie-parser
* cors
* helmet
* express-rate-limit

### Frontend

* Next.js
* React
* Tailwind CSS
* Axios
* React Hook Form

## Project Goal

The goal of this repository is to build a complete authentication system from scratch and understand how authentication works in production-grade applications. This project is designed for practical learning rather than tutorial copying.

## Folder Structure

```text
AUTH-HUB/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── templates/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── index.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── services/
│   ├── utils/
│   ├── package.json
│   └── .env.local
│
└── README.md
```

## How It Works

1. A user signs up with name, email, and password.
2. The password is hashed using `bcryptjs`.
3. A verification token or OTP is generated using `crypto`.
4. An email is sent using Nodemailer.
5. The user verifies their account.
6. The user logs in and receives access and refresh tokens.
7. Protected routes validate the token before granting access.
8. Forgot-password and reset-password flows use secure token generation and expiry handling.

## Environment Variables

### Backend `.env`

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

FRONTEND_URL=http://localhost:3000
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

## Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Auth

* `POST /api/v1/auth/register`
* `POST /api/v1/auth/login`
* `POST /api/v1/auth/logout`
* `POST /api/v1/auth/refresh-token`
* `POST /api/v1/auth/verify-email`
* `POST /api/v1/auth/forgot-password`
* `POST /api/v1/auth/reset-password`
* `POST /api/v1/auth/verify-otp`

### User

* `GET /api/v1/user/me`
* `PATCH /api/v1/user/profile`
* `PATCH /api/v1/user/change-password`

## Authentication Concepts Practiced

This project is designed to help understand:

* password hashing
* token generation
* token verification
* cookie-based auth
* access vs refresh tokens
* secure email verification
* one-time password flows
* session tracking
* route protection
* request validation
* error handling
* authentication security best practices

## Why `crypto` is Used

`crypto` is used for secure random token generation and hashing verification/reset tokens before saving them in the database. This makes verification links and reset flows safer and more realistic.

## Future Enhancements

* Google OAuth login
* Multi-device session management
* Logout from a single device
* Avatar upload
* Admin dashboard
* Email templates
* Two-factor authentication
* Activity logs
* Subscription-based auth features

## Deployment

* Frontend: Vercel
* Backend: Render, Railway, or a VPS
* Database: MongoDB Atlas

## License

This project is for learning and portfolio use.

## Status

In development.
