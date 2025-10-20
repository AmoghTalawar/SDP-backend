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
  origin: ["http://localhost:3000", "http://localhost:3001", "https://sdp-client-cy7h.vercel.app", "https://sdp-client-tau.vercel.app"],
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint (no database needed)
app.get("/", (req, res) => {
  res.send("✅ API is running successfully on Vercel!");
});

// Simple health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    mongodb_uri_configured: !!process.env.MONGO_URI,
    jwt_secret_configured: !!process.env.JWT_SECRET
  });
});

// Test endpoint without database
app.get("/test", (req, res) => {
  res.json({
    message: "Server is responding correctly",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    mongodb_uri_configured: !!process.env.MONGO_URI,
    jwt_secret_configured: !!process.env.JWT_SECRET
  });
});

// Database connectivity test (optional)
app.get("/db-test", async (req, res) => {
  try {
    const connectDB = (await import("./config/db.js")).default;
    const conn = await connectDB();
    res.json({
      message: "Database connection successful",
      host: conn.connection.host,
      status: "connected"
    });
  } catch (error) {
    res.status(503).json({
      message: "Database connection failed",
      error: error.message,
      status: "disconnected"
    });
  }
});

// Simple login test with mock data (for testing when DB is down)
app.post("/test-login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      code: 400,
      success: false,
      message: "Email and Password Both are Required",
    });
  }

  // Mock successful login for testing
  if (email === "test@test.com" && password === "test123") {
    return res.json({
      code: 200,
      message: "Test login successful",
      data: {
        _id: "test-user-id",
        name: "Test User",
        email: email,
        role: "admin",
        token: "test-token-123",
      },
    });
  }

  res.status(401).json({
    code: 401,
    success: false,
    message: "Test credentials: test@test.com / test123",
  });
});

// Database connectivity test (optional)
app.get("/db-test", async (req, res) => {
  try {
    const connectDB = (await import("./config/db.js")).default;
    const conn = await connectDB();
    res.json({
      message: "Database connection successful",
      host: conn.connection.host,
      status: "connected"
    });
  } catch (error) {
    res.status(503).json({
      message: "Database connection failed",
      error: error.message,
      status: "disconnected"
    });
  }
});

// Simple login test with mock data (for testing when DB is down)
app.post("/test-login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      code: 400,
      success: false,
      message: "Email and Password Both are Required",
    });
  }

  // Mock successful login for testing
  if (email === "test@test.com" && password === "test123") {
    return res.json({
      code: 200,
      message: "Test login successful",
      data: {
        _id: "test-user-id",
        name: "Test User",
        email: email,
        role: "admin",
        token: "test-token-123",
      },
    });
  }

  res.status(401).json({
    code: 401,
    success: false,
    message: "Test credentials: test@test.com / test123",
  });
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

    // Handle specific MongoDB timeout errors
    if (error.name === 'MongooseTimeoutError' || error.message.includes('buffering timed out')) {
      return res.status(503).json({
        message: "Database temporarily unavailable",
        error: "Connection timeout - please try again"
      });
    }

    // Return service unavailable instead of crashing
    res.status(503).json({
      message: "Service temporarily unavailable",
      error: "Database connection failed"
    });
  }
};

// Apply database middleware and routes
app.use("/api/location", dbMiddleware, locationRoutes);
app.use("/api/user", dbMiddleware, userRoutes);
app.use("/api/patient", dbMiddleware, patientRoutes);
app.use("/api/camp", dbMiddleware, campRoutes);
app.use("/api/iot", dbMiddleware, iotRoutes);
app.use("/api/prediction", dbMiddleware, predictionRoutes);

// Add a simple fallback route for testing
app.get("/ping", (req, res) => {
  res.json({
    message: "Server is responding",
    timestamp: new Date().toISOString()
  });
});

// Add a simple fallback route for testing
app.get("/ping", (req, res) => {
  res.json({
    message: "Server is responding",
    timestamp: new Date().toISOString()
  });
});

app.use(helmet());

// Error handling middleware (should be last)
app.use(notFound);
app.use(errorHandler);

// Export for Vercel serverless
export default app;