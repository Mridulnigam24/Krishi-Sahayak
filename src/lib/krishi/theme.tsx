import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Mode = "light" | "dark";
type Ctx = { mode: Mode; toggle: () => void };
const ThemeCtx = createContext<Ctx>({ mode: "light", toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    const saved = localStorage.getItem("ks_theme");
    const initial: Mode =
      saved === "dark" || saved === "light"
        ? saved
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    setMode(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  // Side effects must live outside the state updater — React invokes updaters
  // twice in StrictMode, which cancelled the class/localStorage change.
  const toggle = () => {
    const next: Mode = mode === "dark" ? "light" : "dark";
    setMode(next);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    localStorage.setItem("ks_theme", mode);
  }, [mode]);

  return <ThemeCtx.Provider value={{ mode, toggle }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);