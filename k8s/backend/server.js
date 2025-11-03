import express from "express";
import mongoose from "mongoose";
import { createClient } from "redis";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/mydb";
const REDIS_HOST = process.env.REDIS_HOST || "redis"; // tên service trong docker-compose
const REDIS_PORT = process.env.REDIS_PORT || 6379;

// ---------------------- MongoDB ----------------------
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ---------------------- Redis ----------------------
const redis = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

redis.on("error", (err) => console.error("❌ Redis error:", err));
redis.on("connect", () => console.log("✅ Connected to Redis"));

(async () => {
  try {
    await redis.connect();
  } catch (err) {
    console.error("❌ Failed to connect Redis:", err);
  }
})();

// ---------------------- Routes ----------------------
app.get("/", (req, res) => {
  res.json({ message: "Backend API running successfully!" });
});

// ---------------------- Start Server ----------------------
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
