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
  if (text.toLowerCase().startsWith("epi")) {
    return (
      <span className={cn("", className)}>
        <span className="text-accent font-bold">epi</span>
        {text.slice(3)}
      </span>
    );
  }
  return <span className={className}>{text}</span>;
}
