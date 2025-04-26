import { createContext, useContext } from "react";

export type Theme = "light" | "dark" | "system";
export type FontSize = "default" | "large" | "x-large";
export type ReducedMotion = "default" | "reduced";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  reducedMotion: ReducedMotion;
  setReducedMotion: (motion: ReducedMotion) => void;
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
