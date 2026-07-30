import express from "express";
import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
// importing all these functions from auth.controller.js file
import {
  verifyEmail,
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
} from "../controllers/auth.controller.js";


const router = Router();

// Route for user registration
router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification-email", resendVerificationEmail);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.patch("/change-password", verifyJWT, changeCurrentPassword);
router.get("/me", verifyJWT, getCurrentUser);
router.patch("/me", verifyJWT, updateAccountDetails);


export default router;