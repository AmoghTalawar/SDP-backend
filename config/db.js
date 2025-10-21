import mongoose from "mongoose";

// Global connection cache for serverless
let cachedConnection = null;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 3;
const CONNECTION_RETRY_DELAY = 1000; // 1 second delay between retries

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

    // Modern MongoDB connection options for serverless
    const options = {
      maxPoolSize: 5, // Maintain up to 5 socket connections
      serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
      socketTimeoutMS: 30000, // Close sockets after 30 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // Disable mongoose buffering
      maxIdleTimeMS: 15000, // Close connections after 15 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };

    // For Vercel serverless, add connection timeout and retry logic
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
      throw new Error(`Failed to connect to MongoDB after ${MAX_CONNECTION_ATTEMPTS} attempts: ${error.message}`);
    }

    // For serverless environments, don't retry immediately - let the function fail and retry on next invocation
    throw new Error(`Database connection failed: ${error.message}`);
  }
};

export default connectDB;
