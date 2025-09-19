"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: "dark" | "light";
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  actualTheme: "light",
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "chronoflow-ui-theme",
  ...props
}: ThemeProviderProps) {
  // Avoid accessing localStorage during SSR — initialize with default and hydrate on mount
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  const [actualTheme, setActualTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null;
      if (stored) setThemeState(stored);
    } catch (e) {
      // ignore
    }
  }, [storageKey]);

  useEffect(() => {
    const root = window.document.documentElement;

    const getSystemTheme = () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    const applyTheme = (newTheme: Theme) => {
      let resolvedTheme: "dark" | "light";

      if (newTheme === "system") {
        resolvedTheme = getSystemTheme();
      } else {
        resolvedTheme = newTheme;
      }

      root.classList.remove("light", "dark");
      root.classList.add(resolvedTheme);
      setActualTheme(resolvedTheme);
    };

    applyTheme(theme);

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      if (typeof mediaQuery.addEventListener === "function") {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      }
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme]);

  const setTheme = (t: Theme) => {
    try {
      localStorage.setItem(storageKey, t);
    } catch (e) {
      // ignore
    }
    setThemeState(t);
  };

  const value = {
    theme,
    setTheme,
    actualTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};