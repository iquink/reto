export type Theme = "light" | "dark" | "system";
export type FontSize = "default" | "large" | "x-large";
export type ReducedMotion = "default" | "reduced";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: (newTheme?: Theme) => void;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  reducedMotion: ReducedMotion;
  setReducedMotion: (motion: ReducedMotion) => void;
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
}
