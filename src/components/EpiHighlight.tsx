import { cn } from "@/lib/utils";

interface EpiHighlightProps {
  text: string;
  className?: string;
}

/**
 * Highlights "epi" prefix in text with the brand yellow accent color
 * Usage: <EpiHighlight text="epiSolve" /> renders "epi" in yellow, "Solve" in default
 */
export function EpiHighlight({ text, className }: EpiHighlightProps) {
  return <span className={className}>{text}</span>;
}
