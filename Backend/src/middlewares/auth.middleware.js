import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_ACCESSTOKEN_SECRET);
    // Attach the decoded token to the request object for further use
    req.user = decodedToken;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }
});

export { verifyJWT };