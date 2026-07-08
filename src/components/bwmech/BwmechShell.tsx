import { ReactNode } from "react";
import { Link } from "react-router-dom";
import episolveLogo from "@/assets/episolve-logo-horizontal.png";

interface Props {
  children: ReactNode;
}

export function BwmechShell({ children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center" aria-label="Episolve home">
            <img src={episolveLogo} alt="Episolve" className="h-20 w-auto" />
          </Link>
          <Link
            to="/projects/bwmech/dashboard"
            className="text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            Broadway Mechanical · Discovery
          </Link>
        </div>
      </header>
      {children}
      <footer className="mt-16 border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground">
          <span>
            Powered by{" "}
            <a
              href="https://episolve.com"
              className="font-medium text-foreground hover:text-primary"
            >
              Episolve
            </a>
          </span>
          <span>Confidential · Broadway Mechanical LLC discovery</span>
        </div>
      </footer>
    </div>
  );
}