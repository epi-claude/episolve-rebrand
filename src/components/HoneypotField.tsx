import { useEffect, useRef } from "react";

interface HoneypotFieldProps {
  onChange: (value: string) => void;
}

/**
 * Invisible honeypot field to catch bots.
 * Bots will fill this field, humans won't see it.
 */
export function HoneypotField({ onChange }: HoneypotFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Add a small delay to prevent autofill from triggering
    const timeout = setTimeout(() => {
      if (inputRef.current) {
        onChange(inputRef.current.value);
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [onChange]);

  return (
    <div
      aria-hidden="true"
      className="absolute -left-[9999px] -top-[9999px] opacity-0 h-0 w-0 overflow-hidden pointer-events-none"
    >
      {/* Use a tempting field name that bots love to fill */}
      <label htmlFor="website_url">Website</label>
      <input
        ref={inputRef}
        type="text"
        id="website_url"
        name="website_url"
        autoComplete="off"
        tabIndex={-1}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
