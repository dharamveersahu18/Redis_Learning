
import express from "express";
import Redis from "ioredis";
import "dotenv/config";

const app = express();
app.use(express.json());

const redis = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

const STREAM_KEY = "notifications:stream";

app.post("/notifications", async (req, res) => {
  try {
    const { title, userId } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "title is required"
      });
    }

    const id = await redis.xadd(
      STREAM_KEY,
      "*",
      "title", title.trim(),
      "userId", typeof userId === "string" ? userId : "unknown",
      "createdAt", new Date().toISOString()
    );

    return res.status(201).json({
      message: "Notification stored",
      id
    });
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      message: "Failed to store notification"
    });
  }
});

app.listen(3002, () => {
  console.log("Stream producer running on port 3002");
});
