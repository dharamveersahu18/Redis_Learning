
import express from "express";
import Redis from "ioredis";
import "dotenv/config";

const app = express();
app.use(express.json());

const publisher = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

const STREAM_KEY = "notifications:stream";

app.post("/notifications", async (req, res) => {
  try {
    const { title, userId } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "title is required"
      });
    }

    const id = await publisher.xadd(
      STREAM_KEY,
      "*",
      "title", title.trim(),
      "userId", typeof userId === "string" ? userId : "unknown",
      "createdAt", new Date().toISOString()
    );

    return res.status(201).json({
      success: true,
      message: "Notification stored successfully",
      id
    });
  } catch (error) {
    console.error("Stream error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to store notification"
    });
  }
});

app.listen(3000, () => {
  console.log("Notification Streams API running on port 3000");
});
