/**
 * Server-side spam detection utilities
 */

// Minimum time (ms) for legitimate form submission
const MIN_FORM_TIME_MS = 2000; // 2 seconds (slightly lower than client for network latency)

// Suspicious patterns that indicate spam
const SPAM_PATTERNS = [
  /\[url=/i, // BBCode links
  /\[link=/i, // BBCode links
  /<a\s+href=/i, // HTML links
  /http[s]?:\/\/[^\s]{50,}/i, // Very long URLs
  /\b(viagra|cialis|casino|poker|lottery|prize|winner|claim|free\s*money)\b/i, // Common spam words
  /(.)\1{10,}/i, // Repeated characters (10+)
  /[а-яА-ЯёЁ]{20,}/i, // Long Cyrillic strings (common in spam)
];

// Suspicious email patterns
const SPAM_EMAIL_PATTERNS = [
  /@(mailinator|guerrillamail|tempmail|fakeinbox|throwaway)/i,
  /^[a-z]{15,}@/i, // Very long random usernames
  /\d{6,}@/i, // Lots of numbers in email
];

export interface SpamCheckPayload {
  _honeypot?: string;
  _formTime?: number;
  _timestamp?: number;
}

export interface SpamCheckResult {
  isSpam: boolean;
  reason?: string;
  score: number; // 0-100, higher = more likely spam
}

export function checkForSpam(
  content: {
    name?: string;
    email?: string;
    message?: string;
    company?: string;
  },
  spamPayload?: SpamCheckPayload
): SpamCheckResult {
  let score = 0;
  const reasons: string[] = [];

  // Check honeypot
  if (spamPayload?._honeypot && spamPayload._honeypot.length > 0) {
    return { isSpam: true, reason: "honeypot_filled", score: 100 };
  }

  // Check form time
  if (spamPayload?._formTime && spamPayload._formTime < MIN_FORM_TIME_MS) {
    score += 40;
    reasons.push("submitted_too_fast");
  }

  // Check message for spam patterns
  const message = content.message || "";
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(message)) {
      score += 30;
      reasons.push("spam_pattern_in_message");
      break;
    }
  }

  // Check email for spam patterns
  const email = content.email || "";
  for (const pattern of SPAM_EMAIL_PATTERNS) {
    if (pattern.test(email)) {
      score += 25;
      reasons.push("suspicious_email");
      break;
    }
  }

  // Check for excessive URLs in message
  const urlMatches = message.match(/https?:\/\//gi) || [];
  if (urlMatches.length > 3) {
    score += 20;
    reasons.push("too_many_urls");
  }

  // Check for suspicious name patterns
  const name = content.name || "";
  if (/^[A-Z][a-z]+\s[A-Z][a-z]+\d+$/.test(name)) {
    // Names like "John Smith123"
    score += 15;
    reasons.push("suspicious_name");
  }

  // Check for all caps (yelling/spam indicator)
  if (message.length > 20 && message === message.toUpperCase()) {
    score += 15;
    reasons.push("all_caps_message");
  }

  // Determine if spam based on score threshold
  const isSpam = score >= 50;

  return {
    isSpam,
    reason: reasons.length > 0 ? reasons.join(", ") : undefined,
    score,
  };
}

/**
 * Extract spam check payload from request body
 */
export function extractSpamPayload(body: Record<string, unknown>): SpamCheckPayload {
  return {
    _honeypot: typeof body._honeypot === "string" ? body._honeypot : undefined,
    _formTime: typeof body._formTime === "number" ? body._formTime : undefined,
    _timestamp: typeof body._timestamp === "number" ? body._timestamp : undefined,
  };
}
