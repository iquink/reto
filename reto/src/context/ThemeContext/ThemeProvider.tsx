import React, { useState, ReactNode, useEffect, useMemo } from "react";
import { FontSize, ReducedMotion, Theme } from "./types";
import { ThemeContext } from "./hooks";

/**
 * ThemeProvider component props interface
 * @interface ThemeProviderProps
 */
interface ThemeProviderProps {
  /** Child components that will have access to the ThemeContext */
  children: ReactNode;
}

/**
 * ThemeProvider component provides theme-related context to its children.
 * It manages and applies user preferences for theme, font size, and reduced motion.
 *
 * @param {ThemeProviderProps} props - The component props
 * @returns {JSX.Element} The ThemeProvider component wrapping its children with ThemeContext
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get system preferences
  const prefersDarkMode = useMemo(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
    []
  );

  const prefersReducedMotionQuery = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)"),
    []
  );

  const prefersHighContrastQuery = useMemo(
    () => window.matchMedia("(forced-colors: active)"),
    []
  );

  // Setup state with system preferences as initial values
  const [theme, setThemeState] = useState<Theme>(
    (localStorage.getItem("theme") as Theme) || "system"
  );
  const [fontSize, setFontSizeState] = useState<FontSize>(
    (localStorage.getItem("fontSize") as FontSize) || "default"
  );
  const [reducedMotion, setReducedMotionState] = useState<ReducedMotion>(
    (localStorage.getItem("reducedMotion") as ReducedMotion) || "default"
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(
    prefersReducedMotionQuery.matches
  );
  const [prefersHighContrast, setPrefersHighContrast] = useState<boolean>(
    prefersHighContrastQuery.matches
  );

  /**
   * Toggles or sets the theme
   *
   * @param {Theme} [newTheme] - Optional theme to set. If not provided, toggles between light and dark.
   */
  const toggleTheme = (newTheme?: Theme) => {
    if (newTheme) {
      // If a specific parameter is passed, set that theme
      localStorage.setItem("theme", newTheme);
      setThemeState(newTheme);
    } else {
      // If no parameter is passed, toggle between light and dark
      setThemeState((prevTheme) => {
        // Determine the current effective theme
        const currentEffectiveTheme =
          prevTheme === "system"
            ? prefersDarkMode
              ? "dark"
              : "light"
            : prevTheme;

        // Toggle directly between light and dark
        const newTheme = currentEffectiveTheme === "light" ? "dark" : "light";
        localStorage.setItem("theme", newTheme);
        return newTheme;
      });
    }
  };

  /**
   * Sets the theme directly
   *
   * @param {Theme} newTheme - The theme to set
   */
  const setTheme = (newTheme: Theme) => {
    localStorage.setItem("theme", newTheme);
    setThemeState(newTheme);
  };

  /**
   * Sets the font size
   *
   * @param {FontSize} size - The font size to set
   */
  const setFontSize = (size: FontSize) => {
    localStorage.setItem("fontSize", size);
    setFontSizeState(size);
  };

  /**
   * Sets the reduced motion preference
   *
   * @param {ReducedMotion} motion - The reduced motion setting to apply
   */
  const setReducedMotion = (motion: ReducedMotion) => {
    localStorage.setItem("reducedMotion", motion);
    setReducedMotionState(motion);
  };

  // Apply the theme to the document
  useEffect(() => {
    const rootElement = document.documentElement;
    const effectiveTheme =
      theme === "system" ? (prefersDarkMode ? "dark" : "light") : theme;

    // Remove previous theme
    rootElement.removeAttribute("data-theme");

    // Set new theme
    if (effectiveTheme === "dark") {
      rootElement.setAttribute("data-theme", "dark");
    }

    // Apply font size
    rootElement.style.fontSize =
      fontSize === "large"
        ? "112.5%"
        : fontSize === "x-large"
        ? "125%"
        : "100%";
  }, [theme, fontSize, prefersDarkMode]);

  // Listen for system preference changes
  useEffect(() => {
    const darkModeHandler = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        document.documentElement.setAttribute(
          "data-theme",
          e.matches ? "dark" : "light"
        );
      }
    };

    const reducedMotionHandler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    const highContrastHandler = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };

    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    darkModeMediaQuery.addEventListener("change", darkModeHandler);

    prefersReducedMotionQuery.addEventListener("change", reducedMotionHandler);
    prefersHighContrastQuery.addEventListener("change", highContrastHandler);

    return () => {
      darkModeMediaQuery.removeEventListener("change", darkModeHandler);
      prefersReducedMotionQuery.removeEventListener(
        "change",
        reducedMotionHandler
      );
      prefersHighContrastQuery.removeEventListener(
        "change",
        highContrastHandler
      );
    };
  }, [theme, prefersReducedMotionQuery, prefersHighContrastQuery]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        fontSize,
        setFontSize,
        reducedMotion,
        setReducedMotion,
        prefersReducedMotion,
        prefersHighContrast,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
