
import redis from "../config/redis.js";

const rateLimitScript = `
  local count = redis.call("INCR", KEYS[1])

  if count == 1 then
    redis.call("PEXPIRE", KEYS[1], ARGV[1])
  end

  local ttl = redis.call("PTTL", KEYS[1])

  return {count, ttl}
`;

export function rateLimiter(options = {}) {
  const maxRequests = options.maxRequests ?? 5;
  const windowMs = options.windowMs ?? 60000;

  return async function (req, res, next) {
    try {
      // Identify the client.
      const clientIp = req.ip || req.socket.remoteAddress;
      const key = `rate-limit:${clientIp}`;

      // Execute the Redis script and wait for its result.
      const result = await redis.eval(rateLimitScript, {
        keys: [key],
        arguments: [String(windowMs)],
      });

      console.log("Redis rate-limit result:", result);

      const count = Number(result[0]);
      const ttl = Number(result[1]);

      const remaining = Math.max(0, maxRequests - count);
      const resetSeconds = Math.max(0, Math.ceil(ttl / 1000));

      // Send rate-limit information in the response headers.
      res.set("RateLimit-Limit", String(maxRequests));
      res.set("RateLimit-Remaining", String(remaining));
      res.set("RateLimit-Reset", String(resetSeconds));

      // Reject requests that exceed the limit.
      if (count > maxRequests) {
        res.set("Retry-After", String(resetSeconds));

        return res.status(429).json({
          success: false,
          message: "Too many requests. Try again later.",
          limit: maxRequests,
          retryAfterSeconds: resetSeconds,
        });
      }

      // Allow the request.
      next();
    } catch (error) {
      console.error("Rate limiter error:", error.message);
      next(error);
    }
  };
}
