import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import connectDB from "../config/db.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (!process.env.JWT_SECRET) {
        res.status(500);
        throw new Error("Server configuration error");
      }

      // Verify JWT token first (without database)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Ensure database connection before querying user
      try {
        await connectDB();
      } catch (dbError) {
        console.error("Database connection failed in auth middleware:", dbError.message);
        res.status(503);
        throw new Error("Database temporarily unavailable");
      }

      // Now query the user from database
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }

      // if (!req.user.emailVerified) {
      //   res.status(403).json({ error: "You need to verify your account" });
      //   throw new Error("Not authorized, no token");
      // }

      next();
    } catch (error) {
      console.error("Auth middleware error:", error.message);

      if (error.message === "Database temporarily unavailable") {
        res.status(503);
        throw error;
      }

      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
};

export { protect, admin };
