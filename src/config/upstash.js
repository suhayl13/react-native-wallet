import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import "dotenv/config";

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(2, "60 s") 
});

// For testing purposes
// await redis.set("foo", "bar");
// await redis.get("foo");

export default ratelimit;