
import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});

function otpKey(phone) {
  return `otp:${phone}`;
}

// 1. Generate OTP
app.post("/otp", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        message: "Phone is required",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await redis.set(otpKey(phone), otp, "EX", 30);

    // Demo only: don't return OTP in a real application.
    res.json({
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate OTP" });
  }
});

// 2. Verify OTP
app.post("/otp/:phone/verify", async (req, res) => {
  try {
    const { phone } = req.params;
    const { otp } = req.body;

    const savedOtp = await redis.get(otpKey(phone));

    if (savedOtp === null) {
      return res.status(404).json({
        message: "OTP not found or expired",
      });
    }

    if (savedOtp !== String(otp)) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    await redis.del(otpKey(phone));

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to verify OTP" });
  }
});

// 3. Check remaining TTL
app.get("/otp/:phone/ttl", async (req, res) => {
  try {
    const { phone } = req.params;
    const ttl = await redis.ttl(otpKey(phone));

    if (ttl === -2) {
      return res.status(404).json({
        message: "OTP not found or expired",
      });
    }

    res.json({ phone, remainingSeconds: ttl });
  } catch (error) {
    res.status(500).json({ message: "Failed to check TTL" });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});