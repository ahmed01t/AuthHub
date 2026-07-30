const verificationEmailTemplate = (user, token) => {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    return `
      <html>
        <body>
          <h1>Email Verification</h1>
          <p>Hello ${user.username},</p>
          <p>Thank you for registering! Please click the link below to verify your email address:</p>
          <a href="${verificationLink}">Verify Email</a>
          <p>If you did not create an account, please ignore this email.</p>
        </body>
      </html>
    `;
  }

