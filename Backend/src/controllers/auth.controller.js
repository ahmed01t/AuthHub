import asyncHandler from "../utils/asynchandler";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto, { createHash } from "crypto";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

const createHash = (value) => { 
    crypto.createHash("sha256").update(value).digest("hex");
}
const generateAccessAndRefreshTokens = async (userId) => {
    const user= await User.findById(userId);
    if(!user){
        throw new ApiError(404,"User not found");
    }
    const accessToken = jwt.sign({ id: user._id, email: user.email , username: user.username ,role: user.role}, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "20m",
    });

    const refreshToken = jwt.sign({ id: user._id, email: user.email , username: user.username ,role: user.role}, process.env.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d",
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
      <p>Hi ${fullName},</p>
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
    const hashedVerificationToken = createHash(verificationToken);

    
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

return res.status(201).json(new ApiResponse(201, "User registered successfully. Please check your email to verify your account.", { userId: user._id }));
})

const verifyEmail = asyncHandler(async (req, res) => {
    const { email, token } = req.body;
    if(!email || !token){
        throw new ApiError(400,"Email and token are required");
    }

    const normalizedEmail = email.toLowerCase().trim();
    const hashedToken = createHash(token);

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

    const tokens = await generateAccessAndRefreshTokens(user._id);
    return res.status(200).json(new ApiResponse(200,"Email verified successfully", { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }));

})