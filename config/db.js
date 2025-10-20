import mongoose from "mongoose";

// Global connection cache for serverless
let cachedConnection = null;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 2; // Reduced for faster failure

const connectDB = async () => {
  try {
    // Return cached connection if available and healthy
    if (cachedConnection && mongoose.connection.readyState === 1) {
      console.log("Using cached MongoDB connection");
      return cachedConnection;
    }

    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MongoDB URI not provided in environment variables");
    }

    // Check if we've exceeded max connection attempts
    if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
      console.log("Max connection attempts reached, resetting counter");
      connectionAttempts = 0;
    }

    connectionAttempts++;
    console.log(`MongoDB connection attempt ${connectionAttempts}/${MAX_CONNECTION_ATTEMPTS}`);

    // Ultra-minimal connection options for serverless
    const options = {
      serverSelectionTimeoutMS: 600, // 0.6 seconds (very fast)
      socketTimeoutMS: 1500, // 1.5 seconds (minimum)
      connectTimeoutMS: 600, // 0.6 seconds connection timeout
      bufferCommands: false,
      bufferMaxEntries: 0,
      maxPoolSize: 1,
      minPoolSize: 0,
      maxIdleTimeMS: 600,
      family: 4,
      heartbeatFrequencyMS: 30000,
    };

    const conn = await mongoose.connect(mongoUri, options);
    cachedConnection = conn;
    connectionAttempts = 0; // Reset on successful connection

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error (attempt ${connectionAttempts}): ${error.message}`);
    cachedConnection = null;

    // If we've tried multiple times, throw the error
    if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
      connectionAttempts = 0;
      throw new Error(`Failed to connect to MongoDB after ${MAX_CONNECTION_ATTEMPTS} attempts`);
    }

    throw error;
  }
};

export default connectDB;
