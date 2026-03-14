import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { env } from "../config/env.js";
import { AppError, asyncHandler } from "./errorHandler.js";

export const isAuth = asyncHandler(async (req, res, next) => {
    // Check for token in Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      // Fallback for backward compatibility
      token = req.headers.token;
    }

    if (!token) {
      throw new AppError("Please login first.", 401);
    }

    let decodedData;
    try {
      decodedData = jwt.verify(token, env.jwtSecret);
    } catch (error) {
      throw new AppError("Invalid or expired token.", 401);
    }

    const user = await User.findById(decodedData.sub || decodedData._id);

    if (!user) {
      throw new AppError("User not found or token is invalid.", 401);
    }

    req.user = user;
    next();
});

export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not an admin",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Authorization middleware failed",
    });
  }
};
