import { useRef, useCallback } from "react";

// Minimum time (in ms) a human would take to fill out a form
const MIN_FORM_TIME_MS = 3000; // 3 seconds

export function useSpamProtection() {
  const formLoadedAt = useRef<number>(Date.now());
  const honeypotValue = useRef<string>("");

  // Reset timer when form is shown/reset
  const resetTimer = useCallback(() => {
    formLoadedAt.current = Date.now();
  }, []);

  // Update honeypot value (should always be empty for real users)
  const setHoneypot = useCallback((value: string) => {
    honeypotValue.current = value;
  }, []);

  // Validate submission
  const validateSubmission = useCallback((): { isValid: boolean; reason?: string } => {
    // Check honeypot - if filled, it's a bot
    if (honeypotValue.current && honeypotValue.current.length > 0) {
      console.log("Spam detected: honeypot filled");
      return { isValid: false, reason: "honeypot" };
    }

    // Check time - if too fast, it's likely a bot
    const timeElapsed = Date.now() - formLoadedAt.current;
    if (timeElapsed < MIN_FORM_TIME_MS) {
      console.log("Spam detected: form submitted too quickly", timeElapsed);
      return { isValid: false, reason: "too_fast" };
    }

    return { isValid: true };
  }, []);

  // Generate spam protection payload for server
  const getSpamCheckPayload = useCallback(() => {
    return {
      _honeypot: honeypotValue.current,
      _formTime: Date.now() - formLoadedAt.current,
      _timestamp: Date.now(),
    };
  }, []);

  return {
    resetTimer,
    setHoneypot,
    validateSubmission,
    getSpamCheckPayload,
  };
}
