import React, { useState, ReactNode, useEffect, useMemo } from "react";
import {
  Theme,
  ThemeContext,
  FontSize,
  ReducedMotion,
} from "./ThemeContext/index";

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
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

  // Toggle theme function
  const toggleTheme = () => {
    setThemeState((prevTheme) => {
      // Определяем текущую эффективную тему
      const currentEffectiveTheme =
        prevTheme === "system"
          ? prefersDarkMode
            ? "dark"
            : "light"
          : prevTheme;

      // Переключаемся между light и dark напрямую
      const newTheme = currentEffectiveTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  // Set theme function
  const setTheme = (newTheme: Theme) => {
    localStorage.setItem("theme", newTheme);
    setThemeState(newTheme);
  };

  // Set font size function
  const setFontSize = (size: FontSize) => {
    localStorage.setItem("fontSize", size);
    setFontSizeState(size);
  };

  // Set reduced motion function
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
