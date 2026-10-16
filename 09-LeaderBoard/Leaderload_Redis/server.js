import express from "express";
import Redis from "ioredis";
import cors from "cors";
const app = express();

const redis = new Redis(process.env.Redis_URL || "redis://localhost:6379");

const LEADERBOARD_KEY = "leaderboard";
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.post("/score", async (req, res) => {
  try {
    const { userId, score } = req.body;

    // validate userId
    if (typeof userId !== "string" || !userId.trim()) {
      return res.status(400).json({
        message: "userId is required",
      });
    }
    // validate score
    if (typeof score !== "number" || !Number.isFinite(score) || score < 0) {
      return res.status(400).json({
        message: "Score must be a non negative number",
      });
    }
    await redis.zadd(LEADERBOARD_KEY, score, userId);
    return res.status(200).json({
      message: "Score saved successfully",
      userId,
      score,
    });
  } catch (error) {
    return res.status(500).json({
      message: " Failed to save score",
    });
  }
});

app.get("/leaderboard", async (req, res) => {
  try {
    const result = await redis.zrevrange(LEADERBOARD_KEY, 0, 9, "withScores");

    const leaderboard = [];

    for (let i = 0; i < result.length; i += 2) {
      leaderboard.push({
        rank: leaderboard.length + 1,
        userId: result[i],
        score: Number(result[i + 1]),
      });
    }
    //Return after procesisng all users
      return res.json({ leaderboard });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "failed to fetch leaderboard",
    });
  }
});
//Rank
app.get("/users/:userId/rank", async (req, res) => {
  try {
    const { userId } = req.params;

    const rank = await redis.zrevrank(LEADERBOARD_KEY, userId);

    if (rank == null) {
      return res.status(404).json({
        message: "User not found on leaderboard",
      });
    }
    return res.json({
      userId,
      rank: rank + 1,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch user rank",
    });
  }
});

//score
app.get("/users/:userId/score", async (req, res) => {
  try {
    const { userId } = req.params;

    const score = await redis.zscore(LEADERBOARD_KEY, userId);

    if (score == null) {
      return res.status(404).json({
        message: "USer not found on leaderboard",
      });
    }
    return res.json({
      userId,
      score: Number(score),
    });
  } catch (error) {
    console.error(error);

    res.status(404).json({
      message: "Failed to fetch user score",
    });
  }
});

// Inc user score
app.post("/score/increment", async (req, res) => {
  try {
    const { userId, points } = req.body;
    if (typeof userId !== "string" || !userId.trim()) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    if (typeof points !== "number" || !Number.isFinite(points) || points <= 0) {
      return res.status(400).json({
        message: "points must be positive number",
      });
    }

    const updateScore = await redis.zincrby(LEADERBOARD_KEY, points, userId);
    return res.json({
      message: "Score increment successfully",
      userId,
      score: Number(updateScore),
    });
  } catch (error) {
    console.error(error);

    res.status(404).json({
      message: "Failed to increment score",
    });
  }
});
app.get("/", (req, res) => {
  res.json({ message: "Redis LeaderBoard API is running" });
});


app.use(express.json());

app.listen(3000, () => {
  console.log("Leaderboard Api is running on port 3000");
});
