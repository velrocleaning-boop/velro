// In-memory rate limiter — replace with Redis (Upstash) for production
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  windowMs: number;
  max: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { windowMs: 60_000, max: 30 }
): RateLimitResult {
  const now = Date.now();
  const existing = store.get(identifier);

  if (!existing || now > existing.resetAt) {
    const entry: RateLimitEntry = { count: 1, resetAt: now + config.windowMs };
    store.set(identifier, entry);
    return { allowed: true, remaining: config.max - 1, resetAt: entry.resetAt };
  }

  existing.count++;
  const allowed = existing.count <= config.max;
  return {
    allowed,
    remaining: Math.max(0, config.max - existing.count),
    resetAt: existing.resetAt,
  };
}

// Preset rate limit profiles
export const limits = {
  auth: { windowMs: 15 * 60_000, max: 10 },     // 10 attempts / 15 min
  booking: { windowMs: 60_000, max: 5 },          // 5 bookings / min
  api: { windowMs: 60_000, max: 60 },             // 60 reqs / min
  strict: { windowMs: 60_000, max: 3 },           // 3 reqs / min (password reset, etc.)
};
