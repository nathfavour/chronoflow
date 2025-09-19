"use client";

import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-9 h-9 p-0"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
