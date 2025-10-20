import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
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

// Middleware
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

// API routes with database connection middleware
const connectDBMiddleware = async (req, res, next) => {
  try {
    // Lazy load the database connection only when needed
    const connectDB = (await import("./config/db.js")).default;
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ message: "Database connection failed" });
  }
};

// Apply database connection middleware only to API routes that need it
app.use("/api/location", connectDBMiddleware, locationRoutes);
app.use("/api/user", connectDBMiddleware, userRoutes);
app.use("/api/patient", connectDBMiddleware, patientRoutes);
app.use("/api/camp", connectDBMiddleware, campRoutes);
app.use("/api/iot", connectDBMiddleware, iotRoutes);
app.use("/api/prediction", connectDBMiddleware, predictionRoutes);

app.use(helmet());

// Error handling middleware (should be last)
app.use(notFound);
app.use(errorHandler);

// Export for Vercel serverless
export default app;