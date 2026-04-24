import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) {
    console.error("❌ MONGO_URI is not set");
    process.exit(1);
  }
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}
