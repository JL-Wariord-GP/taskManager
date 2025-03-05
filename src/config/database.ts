//! src/config/database.ts

import mongoose from "mongoose";
import dotenv from "dotenv";

//! Load environment variables
dotenv.config();

/**
 * Configures and connects to MongoDB using Mongoose.
 */
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI || "";
    if (!mongoURI) {
      throw new Error("No MongoDB URI is configured");
    }
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
