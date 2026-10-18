import "dotenv/config.js"
import { createClient } from "redis"

const redis = createClient({url: process.env.REDIS_URL || "redis://127.0.0.1:6379"});

 redis.on("error",(error)=>{
  console.error("Redis Error:", error.message);
  
});
export default redis