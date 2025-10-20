import mongoose from "mongoose";

// Global connection cache for serverless
let cachedConnection = null;

const connectDB = async () => {
  try {
    // Return cached connection if available
    if (cachedConnection && mongoose.connection.readyState === 1) {
      console.log("Using cached MongoDB connection");
      return cachedConnection;
    }

    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MongoDB URI not provided in environment variables");
    }

    console.log("Establishing new MongoDB connection...");

    // Minimal connection options for serverless
    const options = {
      serverSelectionTimeoutMS: 1500, // 1.5 seconds (very fast)
      socketTimeoutMS: 5000, // 5 seconds (minimum)
      connectTimeoutMS: 1500, // 1.5 seconds connection timeout
      bufferCommands: false,
      bufferMaxEntries: 0,
      maxPoolSize: 1,
      minPoolSize: 0,
      maxIdleTimeMS: 2000,
      family: 4,
    };

    const conn = await mongoose.connect(mongoUri, options);
    cachedConnection = conn;

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    cachedConnection = null; // Reset cache on error
    throw error;
  }
};

export default connectDB;
