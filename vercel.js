import path from "path";
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
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

// Connect to database
connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001", "https://sdp-client-cy7h.vercel.app"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// API routes
app.use("/api/location", locationRoutes);
app.use("/api/user", userRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/camp", campRoutes);
app.use("/api/iot", iotRoutes);
app.use("/api/prediction", predictionRoutes);

app.use(helmet());

// Health check endpoint
app.get("/", (req, res) => {
  res.send("API is running....");
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Export for Vercel serverless
export default app;