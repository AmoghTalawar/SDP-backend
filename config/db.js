import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log("Using existing MongoDB connection");
      return mongoose.connection;
    }

    // Check if connecting
    if (mongoose.connection.readyState === 2) {
      console.log("MongoDB connection in progress...");
      // Wait for connection
      await new Promise((resolve, reject) => {
        mongoose.connection.on("connected", resolve);
        mongoose.connection.on("error", reject);
      });
      return mongoose.connection;
    }

    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MongoDB URI not provided in environment variables");
    }

    console.log("Connecting to MongoDB...");
    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Don't exit process in serverless environment
    throw error;
  }
};

export default connectDB;
