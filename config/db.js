import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log("Using existing MongoDB connection");
      return mongoose.connection;
    }

    // Close existing connection if any
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MongoDB URI not provided in environment variables");
    }

    // Ensure the URI doesn't have problematic parameters for serverless
    const cleanUri = mongoUri.replace(/&w=majority/g, '');

    console.log("Connecting to MongoDB...");

    // Set up connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    // Serverless-optimized connection options
    const options = {
      serverSelectionTimeoutMS: 3000, // 3 seconds timeout (reduced)
      socketTimeoutMS: 30000, // 30 seconds (reduced)
      connectTimeoutMS: 3000, // 3 seconds connection timeout (reduced)
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // Disable mongoose buffering
      maxPoolSize: 1, // Maintain up to 1 socket connections
      minPoolSize: 0, // Don't maintain unnecessary connections
      maxIdleTimeMS: 10000, // Close connections after 10 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      retryReads: true,
      heartbeatFrequencyMS: 10000, // Send heartbeat every 10 seconds
    };

    const conn = await mongoose.connect(cleanUri, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Don't exit process in serverless environment
    throw error;
  }
};

export default connectDB;
