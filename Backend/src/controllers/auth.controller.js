import asyncHandler from "../utils/asynchandler.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import sendEmail from "../utils/sendEmail.js";

const generateHash = (value) => { 
    return crypto.createHash("sha256").update(value).digest("hex");
}
// values in cookieOptions are set to enhance security and control the behavior of cookies in a web application. Here's what each option means:
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const getPublicUser = (user) => {
    return {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        username: user.username,
        isemailverified: user.isemailverified,
        role: user.role,
        avatar: user.avatar
     
    };
};

const generateAccessAndRefreshTokens = async (userId) => {
    const user= await User.findById(userId);
    if(!user){
        throw new ApiError(404,"User not found");
    }
    const accessToken = jwt.sign({ id: user._id, email: user.email , username: user.username ,role: user.role}, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || process.env.ACCESS_TOKEN_EXPIRY || "20m",
    });

    const refreshToken = jwt.sign({ id: user._id, email: user.email , username: user.username ,role: user.role}, process.env.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || process.env.REFRESH_TOKEN_EXPIRY || "7d",
    });
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });


    return { accessToken, refreshToken };
}

const sendVerificationEmail = async ({email,fullname,token}) => {
    // Implementation for sending verification email
//  verify url is the url link that user will click to verify their email
// encoded uri prevents issues with special characters in the email and token when constructing the URL. It ensures that the email and token are properly formatted for use in a URL query string.
// verify url will redirect verify-email 
 const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?email=${encodeURIComponent(
    email
  )}&token=${encodeURIComponent(token)}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Verify your AuthHub account</h2>
      <p>Hi ${fullname},</p>
      <p>Click the button below to verify your email address.</p>
      <p>
        <a href="${verifyUrl}"
           style="display:inline-block;padding:12px 18px;background:#111827;color:#fff;text-decoration:none;border-radius:8px;">
          Verify Email
        </a>
      </p>
      <p>If the button does not work, use this link:</p>
      <p>${verifyUrl}</p>
      <p>This link will expire soon for security reasons.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "Verify your AuthHub account",
    html: html,
  });

}    

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body;
    if (!fullname || !email || !username || !password) {
        throw new ApiError(400, "All fields are required");
    }
const normalizedEmail = email.toLowerCase().trim();
const normalizedUsername = username.toLowerCase().trim();


    const existingUser = await User.findOne({
        $or: [{ email: normalizedEmail }, { username: normalizedUsername }]
    });


    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists");
    }
// Generate a verification token for email verification
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedVerificationToken = generateHash(verificationToken);

    
    const user = await User.create({
        fullname: fullname.trim(),
        email: normalizedEmail,
        username: normalizedUsername,
        password,
        isemailverified: false,
        emailverificationtoken: hashedVerificationToken,
        // new Date means the current date and time, and adding 3600000 milliseconds (1 hour) sets the expiration time for the email verification token to be 1 hour from the moment of user registration. This means that the user has 1 hour to verify their email before the token expires.
        emailverificationtokenexpires: new Date(Date.now() + 3600000), // 1 hour from now
    });
    await sendVerificationEmail({ email: user.email, fullname: user.fullname, token: verificationToken });

return res.status(201).json(new ApiResponse(201, { userId: user._id }, "User registered successfully. Please check your email to verify your account."));
})

const verifyEmail = asyncHandler(async (req, res) => {
    const { email, token } = req.body;
    if(!email || !token){
        throw new ApiError(400,"Email and token are required");
    }

    const normalizedEmail = email.toLowerCase().trim();
    const hashedToken = generateHash(token);

    const user= await User.findOne({
        email: normalizedEmail,
        emailverificationtoken: hashedToken,
        emailverificationtokenexpires: { $gt: new Date() } // Check if token is not expired
    });
    if(!user){
        throw new ApiError(400,"Invalid or expired token");
    }

    user.isemailverified = true;
    user.emailverificationtoken = undefined;
    user.emailverificationtokenexpires = undefined;
    await user.save({ validateBeforeSave: false });

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

 const verifiedUser = await User.findById(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: getPublicUser(verifiedUser),
          accessToken,
          refreshToken,
        },
        "Email verified successfully"
      )
    );
})

const resendVerificationEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if(!email){
        throw new ApiError(400,"Email is required");
    }
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if(!user){
        throw new ApiError(404,"User not found");
    }
    if(user.isemailverified){
        throw new ApiError(400,"Email is already verified");
    }
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedVerificationToken = generateHash(verificationToken);
    user.emailverificationtoken = hashedVerificationToken;
    user.emailverificationtokenexpires = new Date(Date.now() + 3600000);
    await user.save({ validateBeforeSave: false });
    await sendVerificationEmail({ email: user.email, fullname: user.fullname, token: verificationToken });

    return res.status(200).json(new ApiResponse(200, {}, "Verification email resent successfully"));
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        throw new ApiError(400,"Email and password are required");
    }
const user= await User.findOne({ email: email.toLowerCase().trim() }).select("+password +refreshToken");
if(!user){
    throw new ApiError(401,"Invalid email or password");
}
if(!user.isemailverified){
    throw new ApiError(401,"Email is not verified. Please verify your email before logging in.");
}
const isPasswordValid = await bcrypt.compare(password, user.password);
if(!isPasswordValid){
    throw new ApiError(401,"Invalid email or password");
}

const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
const loggedInUser = await User.findById(user._id);

return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
        new ApiResponse(
            200,
            {
                user: getPublicUser(loggedInUser),
                accessToken,
                refreshToken,
            },
            "User logged in successfully"
        )
    );
})

const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(400, "User not authenticated");
    }
    await User.findByIdAndUpdate(userId, { refreshToken: undefined });
    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
   const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
   if (!incomingRefreshToken) {
        throw new ApiError(400, "Refresh token is required");
    }
    let decodedtoken;
    try {
        decodedtoken = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
    } catch (error) {  
        throw new ApiError(401, "Invalid or expired refresh token"); 
    }
    const user=await User.findById(decodedtoken.id).select("+refreshToken +password");
    if(!user){
        throw new ApiError(404,"User not found");
    }
    if (user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, "Refresh token does not match");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken},
                "Access token refreshed successfully"
            )
        );

})

const sendResetPasswordMail = async ({ email, fullname, token }) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?email=${encodeURIComponent(
    email
  )}&token=${encodeURIComponent(token)}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Reset your AuthHub password</h2>
      <p>Hi ${fullname},</p>
      <p>Click the button below to reset your password.</p>
      <p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:12px 18px;background:#111827;color:#fff;text-decoration:none;border-radius:8px;">
          Reset Password
        </a>
      </p>
      <p>If the button does not work, use this link:</p>
      <p>${resetUrl}</p>
      <p>This link will expire soon for security reasons.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "Reset your AuthHub password",
    html,
  });
};

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  // Security best practice: do not reveal whether the email exists.
  if (!user) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "If the account exists, a password reset email has been sent"
        )
      );
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = generateHash(resetToken);

  user.passwordResetToken = resetTokenHash;
  user.passwordResetExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await user.save({ validateBeforeSave: false });

  await sendResetPasswordMail({
    email: user.email,
    fullname: user.fullname,
    token: resetToken,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "If the account exists, a password reset email has been sent"
      )
    );
});


const resetPassword = asyncHandler(async (req, res) => {
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    throw new ApiError(400, "Email, token and new password are required");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const tokenHash = generateHash(token);

  const user = await User.findOne({
    email: normalizedEmail,
    passwordResetToken: tokenHash,
    // $gt means "greater than" in MongoDB queries. In this context, it is used to check if the password reset token has not expired. The query is looking for a user document where the passwordResetExpiresAt field is greater than the current date and time (new Date()). This ensures that the token is still valid and has not passed its expiration time.    
    passwordResetExpiresAt: { $gt: new Date() },
  }).select("+password +refreshToken");

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpiresAt = undefined;
  user.refreshToken = undefined;

  await user.save();

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Password reset successful"));
});


const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, getPublicUser(user), "Current user fetched"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, username } = req.body;

  if (!fullname && !username) {
    throw new ApiError(400, "Nothing to update");
  }

  const user = await User.findById(req.user?.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (fullname) {
    user.fullname = fullname.trim();
  }

  if (username) {
    const normalizedUsername = username.toLowerCase().trim();

    const duplicateUsername = await User.findOne({
      username: normalizedUsername,
      _id: { $ne: user._id },
    });

    if (duplicateUsername) {
      throw new ApiError(409, "Username already taken");
    }

    user.username = normalizedUsername;
  }

  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, getPublicUser(user), "Account updated successfully")
    );
});
 
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current password and new password are required");
  }

  const user = await User.findById(req.user?.id).select(
    "+password +refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Current password is incorrect");
  }

  user.password = newPassword;
  user.refreshToken = undefined;

  await user.save();

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export {
  registerUser,
  verifyEmail,
  resendVerificationEmail,
  sendResetPasswordMail,
  loginUser,
  logoutUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
};
