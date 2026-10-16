
import express from "express";
import Redis from "ioredis";
import "dotenv/config";

const app = express();

app.use(express.json());

const redis = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

// First endpoint: increment a post's view count
app.post("/posts/:id/view", async (req, res) => {
  try {
    const postId = req.params.id;

    // TODO: Create a Redis key for this post
    const key = `post${postId}:views`;
    // TODO: Increment the view count using Redis
    const views =  await redis.incr(key)
    // TODO: Return the updated count as JSON
    return res.json({
      success: true,
      postId,
      views,
    }
    )

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3001, () => {
  console.log("Leaderboard API running on port 3001");
});
