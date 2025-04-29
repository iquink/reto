import { createContext, useContext } from "react";
import { ThemeContextType } from "./types";

/**
 * Context for sharing theme state and functionality throughout the application.
 *
 * @type {React.Context<ThemeContextType | undefined>}
 */
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

/**
 * A hook that provides access to the theme context.
 *
 * @returns {ThemeContextType} The theme context value containing state and functions.
 * @throws {Error} If used outside of a ThemeProvider.
 *
 * @example
 * ```tsx
 * const { theme, toggleTheme } = useTheme();
 *
 * return (
 *   <button onClick={() => toggleTheme("dark")}>
 *     Switch to dark theme
 *   </button>
 * );
 * ```
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
