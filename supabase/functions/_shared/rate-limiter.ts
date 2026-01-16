/**
 * Rate limiter for edge functions
 * Uses in-memory store with sliding window approach
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

// In-memory store for rate limiting (per edge function instance)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 5; // Max 5 requests per window per IP
const CLEANUP_INTERVAL = 5 * 60 * 1000; // Clean up old entries every 5 minutes

// Periodic cleanup of expired entries
let lastCleanup = Date.now();

function cleanupExpiredEntries(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  
  lastCleanup = now;
  const expireTime = now - WINDOW_MS;
  
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.windowStart < expireTime) {
      rateLimitStore.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // milliseconds until reset
}

/**
 * Check if a request should be rate limited
 * @param identifier - Usually the client IP address or a unique identifier
 * @param functionName - Name of the function (to namespace rate limits)
 * @returns RateLimitResult with allowed status and metadata
 */
export function checkRateLimit(
  identifier: string,
  functionName: string = "default"
): RateLimitResult {
  cleanupExpiredEntries();
  
  const key = `${functionName}:${identifier}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  if (!entry || entry.windowStart < now - WINDOW_MS) {
    // No entry or window expired - start fresh
    rateLimitStore.set(key, { count: 1, windowStart: now });
    return {
      allowed: true,
      remaining: MAX_REQUESTS - 1,
      resetIn: WINDOW_MS,
    };
  }
  
  // Within current window
  if (entry.count >= MAX_REQUESTS) {
    const resetIn = entry.windowStart + WINDOW_MS - now;
    return {
      allowed: false,
      remaining: 0,
      resetIn,
    };
  }
  
  // Increment counter
  entry.count++;
  rateLimitStore.set(key, entry);
  
  return {
    allowed: true,
    remaining: MAX_REQUESTS - entry.count,
    resetIn: entry.windowStart + WINDOW_MS - now,
  };
}

/**
 * Extract client IP from request headers
 * Works with various proxy/CDN configurations
 */
export function getClientIP(req: Request): string {
  // Check common headers for client IP (in order of preference)
  const headers = [
    "cf-connecting-ip", // Cloudflare
    "x-real-ip",
    "x-forwarded-for",
    "x-client-ip",
    "true-client-ip",
  ];
  
  for (const header of headers) {
    const value = req.headers.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      const ip = value.split(",")[0].trim();
      if (ip) return ip;
    }
  }
  
  // Fallback to a hash of user-agent + other headers for some uniqueness
  const userAgent = req.headers.get("user-agent") || "unknown";
  const acceptLang = req.headers.get("accept-language") || "";
  return `unknown:${simpleHash(userAgent + acceptLang)}`;
}

/**
 * Simple hash function for fallback identification
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Create a rate limit error response
 */
export function rateLimitResponse(
  result: RateLimitResult,
  corsHeaders: Record<string, string>
): Response {
  const retryAfter = Math.ceil(result.resetIn / 1000);
  
  return new Response(
    JSON.stringify({
      success: false,
      error: "Too many requests. Please try again later.",
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Retry-After": retryAfter.toString(),
        "X-RateLimit-Remaining": result.remaining.toString(),
      },
    }
  );
}
