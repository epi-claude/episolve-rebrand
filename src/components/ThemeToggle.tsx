import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const isHiddenPath = (pathname: string) =>
  pathname.startsWith("/portfolio/yahya") ||
  pathname === "/links" ||
  pathname === "/njcelc-platform-questionnaire" ||
  pathname === "/mcary-operations-discovery";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const theme = params.get("theme");
    if (theme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add("dark");
      window.history.replaceState({}, "", `${window.location.pathname}?theme=dark`);
    } else {
      document.documentElement.classList.remove("dark");
      window.history.replaceState({}, "", window.location.pathname);
    }
  };

  // This check has to stay below the hooks: returning early before useState and
  // useEffect run changes the hook count between renders, which crashes React
  // ("Rendered more hooks than during the previous render").
  if (typeof window !== "undefined" && isHiddenPath(window.location.pathname)) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
