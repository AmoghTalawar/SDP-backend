import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();

const app = express();

// Basic middleware
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001", "https://sdp-client-cy7h.vercel.app", "https://sdp-client-tau.vercel.app"],
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());

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
    jwt_secret_configured: !!process.env.JWT_SECRET,
    vercel_deployment: true,
    deployment_id: process.env.VERCEL_DEPLOYMENT_ID || "local"
  });
});

// Deployment status endpoint
app.get("/deployment-status", (req, res) => {
  res.json({
    status: "deployed",
    message: "Application deployed successfully",
    timestamp: new Date().toISOString(),
    deployment_id: process.env.VERCEL_DEPLOYMENT_ID || "local",
    environment: process.env.NODE_ENV || "development",
    mongodb_uri_configured: !!process.env.MONGO_URI,
    jwt_secret_configured: !!process.env.JWT_SECRET
  });
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

// API routes that require database connections - simplified for deployment
app.get("/api/user/login", (req, res) => {
  res.status(503).json({
    message: "Login functionality temporarily unavailable during deployment",
    deployment_id: process.env.VERCEL_DEPLOYMENT_ID,
    status: "deployment"
  });
});

// Add a simple fallback route for testing
app.get("/ping", (req, res) => {
  res.json({
    message: "Server is responding",
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (should be last)
app.use(notFound);
app.use(errorHandler);

// Export for Vercel serverless
export default app;