import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import User from "./models/userModel.js";
import Patient from "./models/patientModel.js";
import Location from "./models/locationModel.js";
import Camp from "./models/campModel.js";
import { generateToken } from "./utils/generateToken.js";
import { getLanguageFromRequest, translate } from "./utils/translations.js";
import userRoutes from "./routes/userRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import campRoutes from "./routes/campRoutes.js";
import iotRoutes from "./routes/iotRoutes.js";
import predictionRoutes from "./routes/predictionRoute.js";

// Load environment variables
dotenv.config();

const app = express();

// Enhanced CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://sdp-client-cy7h.vercel.app",
      "https://sdp-client-tau.vercel.app",
      "https://sdp-doddabhathi.vercel.app",
      "https://sdp-goa.vercel.app"
    ];

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers"
  ],
  optionsSuccessStatus: 200,
};

// Apply CORS middleware first - but also handle Vercel serverless specifics
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://sdp-client-cy7h.vercel.app",
    "https://sdp-client-tau.vercel.app",
    "https://sdp-doddabhathi.vercel.app",
    "https://sdp-goa.vercel.app"
  ];

  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');

  // Handle preflight requests immediately
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Max-Age', '86400');
    return res.sendStatus(200);
  }

  next();
});

// Also apply the cors middleware as backup
app.use(cors(corsOptions));

// Handle preflight requests explicitly for all routes - this is crucial for Vercel
app.options("/api/*", (req, res) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://sdp-client-cy7h.vercel.app",
    "https://sdp-client-tau.vercel.app",
    "https://sdp-doddabhathi.vercel.app",
    "https://sdp-goa.vercel.app"
  ];

  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.header('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours
  res.sendStatus(200);
});

app.options("*", (req, res) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://sdp-client-cy7h.vercel.app",
    "https://sdp-client-tau.vercel.app",
    "https://sdp-doddabhathi.vercel.app",
    "https://sdp-goa.vercel.app"
  ];

  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.sendStatus(200);
});

// JSON parser after CORS
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(helmet());

// Health check endpoint (no database needed)
app.get("/", (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.send("API is running....");
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

// Database connection test endpoint
app.get("/api/db-test", async (req, res) => {
  try {
    console.log("Testing database connection...");
    const conn = await connectDB();
    console.log("Database connection test successful");

    res.json({
      success: true,
      message: "Database connection successful",
      host: conn.connection.host,
      database: conn.connection.name,
      timestamp: new Date().toISOString(),
      mongodb_uri_configured: !!process.env.MONGO_URI
    });
  } catch (error) {
    console.error("Database connection test failed:", error.message);

    res.status(503).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
      timestamp: new Date().toISOString(),
      mongodb_uri_configured: !!process.env.MONGO_URI,
      suggestion: "Check MongoDB connection string and network access"
    });
  }
});

// Simple login test with mock data (for testing when DB is down)
app.post("/test-login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const language = getLanguageFromRequest(req);
    return res.status(400).json({
      code: 400,
      success: false,
      message: translate('loginRequired', language),
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

// User login endpoint with fallback authentication
app.post("/api/user/login", async (req, res) => {
  try {
    // Set CORS headers explicitly for this endpoint - this is critical for Vercel serverless
    const origin = req.headers.origin;
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://sdp-client-cy7h.vercel.app",
      "https://sdp-client-tau.vercel.app",
      "https://sdp-doddabhathi.vercel.app",
      "https://sdp-goa.vercel.app"
    ];

    if (origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    } else if (origin) {
      // Log blocked origins for debugging
      console.log(`Blocked origin attempt: ${origin}`);
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');

    const { email, password } = req.body;

    if (!email || !password) {
      const language = getLanguageFromRequest(req);
      return res.status(400).json({
        code: 400,
        success: false,
        message: translate('loginRequired', language),
      });
    }

    // Simple authentication without database dependency for now
    console.log("Processing login for:", email);

    // Handle test user
    if (email === "test@test.com" && password === "test123") {
      console.log("Test user authentication successful");
      return res.json({
        code: 200,
        message: "Login successful",
        data: {
          _id: "test-user-id",
          name: "Test User",
          email: email,
          role: "admin",
          token: generateToken("test-user-id"),
        },
      });
    }

    // Handle admin user
    if (email === "admin@admin.com" && password === "123456") {
      console.log("Admin user authentication successful");
      return res.json({
        code: 200,
        message: "Login successful",
        data: {
          _id: "admin-user-id",
          name: "Admin User",
          email: email,
          role: "admin",
          token: generateToken("admin-user-id"),
        },
      });
    }

    // Handle faculty users
    const facultyEmails = [
      "nanda@faulty.com",
      "deviprasad@faulty.com",
      "diwakarpujari@faulty.com",
      "rajesh@faulty.com",
      "dineshmarathi@faulty.com",
      "kumar@faulty.com",
      "nagendra@faulty.com",
      "vidayadar@faulty.com"
    ];

    const nurseEmails = [
      "venkatesh@nurse.com",
      "Netravati@nurse.com",
      "jayalakshmi@nurse.com",
      "philomina@nurse.com",
      "Ranjita@nurse.com",
      "soumya@nurse.com",
      "prasilla@nurse.com"
    ];

    if ((facultyEmails.includes(email) || nurseEmails.includes(email)) && password === "qwerty") {
      const role = facultyEmails.includes(email) ? "faculty" : "nurse";
      console.log(`${role} user authentication successful for: ${email}`);
      return res.json({
        code: 200,
        message: "Login successful",
        data: {
          _id: `${role}-user-id`,
          name: "User",
          email: email,
          role: role,
          token: generateToken(`${role}-user-id`),
        },
      });
    }

    // Try database authentication as fallback
    try {
      console.log("Attempting database authentication...");
      const conn = await connectDB();
      console.log("Database connected successfully");

      const user = await User.findOne({ email });
      console.log("User lookup completed for:", email);

      if (user && user.password === password) {
        console.log("Database authentication successful for:", email);
        const language = getLanguageFromRequest(req);
        return res.json({
          code: 200,
          message: translate('userLoggedIn', language),
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
          },
        });
      } else if (user) {
        console.log("Password mismatch for:", email);
        const language = getLanguageFromRequest(req);
        return res.status(401).json({
          code: 401,
          success: false,
          message: translate('invalidCredentials', language),
        });
      } else {
        console.log("User not found:", email);
        const language = getLanguageFromRequest(req);
        return res.status(404).json({
          code: 404,
          success: false,
          message: translate('userNotFound', language),
        });
      }
    } catch (dbError) {
      console.error("Database authentication failed:", dbError.message);

      // For any other users, return generic error
      return res.status(401).json({
        code: 401,
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      code: 500,
      success: false,
      message: "Internal server error during login",
    });
  }
});

// API Routes for dashboard data fetching - apply CORS middleware to all routes
app.use("/api/location", locationRoutes);
app.use("/api/user", userRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/camp", campRoutes);
app.use("/api/iot", iotRoutes);
app.use("/api/prediction", predictionRoutes);

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