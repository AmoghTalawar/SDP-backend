import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import helmet from "helmet";
import userRoutes from "./routes/userRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import campRoutes from "./routes/campRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import iotRoutes from "./routes/iotRoutes.js";
import predictionRoutes from "./routes/predictionRoute.js";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();

// Basic middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001", "https://sdp-client-cy7h.vercel.app"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint (no database needed)
app.get("/", (req, res) => {
  res.send("API is running....");
});

// Database connection middleware with better error handling
const dbMiddleware = async (req, res, next) => {
  try {
    // Only connect if not already connected
    if (mongoose && mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    // Return service unavailable instead of crashing
    res.status(503).json({
      message: "Service temporarily unavailable",
      error: "Database connection failed"
    });
  }
};

// Apply to all API routes
app.use("/api", dbMiddleware);
app.use("/api/location", locationRoutes);
app.use("/api/user", userRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/camp", campRoutes);
app.use("/api/iot", iotRoutes);
app.use("/api/prediction", predictionRoutes);

app.use(helmet());

// Error handling middleware (should be last)
app.use(notFound);
app.use(errorHandler);

// Export for Vercel serverless
export default app;