import asyncHandler from "../utils/asynchandler";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

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

}    

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body;
    if (!fullname || !email || !username || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists");
    }
    const verif
    const user = await User.create({
        fullname,
        email,
        username,
        password
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});