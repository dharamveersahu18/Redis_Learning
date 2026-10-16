import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(
process.env.REDIS_URL || "redis://localhost:6379",
{
connectTimeout: 5000,
maxRetriesPerRequest: 1,
retryStrategy(times) {
return times <= 3 ? 1000 : null;
},
}
);

redis.on("connect", () => {
console.log("Redis connected");
});

redis.on("error", (err) => {
console.error("Redis error:", err.message);
});

const QUEUE_KEY = "queue:emails";

// Add an email job to Redis
app.post("/emails", async (req, res) => {
console.log("POST /emails received:", req.body);

try {
const { to, subject, body } = req.body;


if (!to) {
  return res.status(400).json({
    error: "Email recipient 'to' is required",
  });
}

const job = {
  to,
  subject: subject || "No subject",
  body: body || "No content",
  createdAt: new Date().toISOString(),
};

await redis.lpush(QUEUE_KEY, JSON.stringify(job));

return res.status(201).json({
  queued: true,
  message: "Email job added to queue",
  job,
});


} catch (error) {
console.error("Queue error:", error.message);


return res.status(500).json({
  error: "Failed to add email to queue",
  details: error.message,
});


}
});

// Process one queued email
app.get("/emails/process-one", async (req, res) => {
try {
const rawJob = await redis.rpop(QUEUE_KEY);


if (!rawJob) {
  return res.json({
    message: "No jobs in the queue",
  });
}

const job = JSON.parse(rawJob);

// Simulate sending an email
return res.json({
  message: "Email processed (simulation only)",
  job,
});


} catch (error) {
console.error("Processing error:", error.message);


return res.status(500).json({
  error: "Failed to process email job",
  details: error.message,
});


}
});

app.listen(3000, () => {
console.log("Server running at http://localhost:3000");
});
