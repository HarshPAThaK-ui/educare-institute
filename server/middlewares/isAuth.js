import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    if (!process.env.Jwt_Sec) {
      return res.status(500).json({
        message: "Server configuration error: JWT secret is missing.",
      });
    }

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
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const decodedData = jwt.verify(token, process.env.Jwt_Sec);
    const user = await User.findById(decodedData._id);

    if (!user) {
      return res.status(401).json({
        message: "User not found or token is invalid",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    return res.status(500).json({
      message: "Authentication middleware failed",
    });
  }
};

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
