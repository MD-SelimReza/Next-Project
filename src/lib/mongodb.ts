import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const NEXT_PUBLIC_MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI as string;

if (!NEXT_PUBLIC_MONGODB_URI) {
  throw new Error("Please define the NEXT_PUBLIC_MONGODB_URI environment variable");
}

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    await mongoose.connect(NEXT_PUBLIC_MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
};
