import "dotenv/config";
import express from "express"
import redis from "./config/redis.js";
import { rateLimiter } from "./middleware/rateLimiter.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const MAX_REQUESTS = Number(process.env.RATE_lIMIT_MAX)|| 5;
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 6000;

app.use(express.json());

// Health Check : verifys wheather Redis is connected.
app.get("/health", (req,res)=>{
  res.json({
    success: true,
    redisReady: redis.isReady,
  })
});

// endpoint procteded by the rate limiter.
app.get("/api/data", rateLimiter({
  maxRequests : MAX_REQUESTS,
   windowMs :WINDOW_MS
}),

(req,res)=>{
  res.json({
    success: true,
    message: "Request allowed!",
    data:{
      product: "Redis Api Rate Limiter",
      status: "active",
    }
  })
}
);

//  Central error handler, include Redis failures.

app.use((error, req, res,next)=>{
  console.error("Request error:",error.message);

  if(res.headersSent){
    return next(err);
  }
  res.status(503).json({
    success:false,
    message: "Service temporarily unavailable.",
  })
});

async function startServer(){
  try {
    await redis.connect();
    
    app.listen(PORT, ()=>{
      console.log(`server running at http://localhost:${PORT}`);
      console.log("redis connected successfully");            
    })
  } catch (error) {
    console.error("Unable to start server:", error.message);
    process.exitCode = 1;
    
  }
}
startServer();