/**
 * Represents the available theme options for the application.
 *
 * @typedef {('light'|'dark'|'system')} Theme
 * @property {'light'} light - Light theme with bright background and dark text
 * @property {'dark'} dark - Dark theme with dark background and light text
 * @property {'system'} system - Automatically matches the system preference
 */
export type Theme = "light" | "dark" | "system";

/**
 * Represents the available font size options for the application.
 *
 * @typedef {('default'|'large'|'x-large')} FontSize
 * @property {'default'} default - Standard font size (16px)
 * @property {'large'} large - Enlarged font size (112.5% or 18px)
 * @property {'x-large'} x-large - Extra large font size (125% or 20px)
 */
export type FontSize = "default" | "large" | "x-large";

/**
 * Represents the available motion reduction options for the application.
 *
 * @typedef {('default'|'reduced')} ReducedMotion
 * @property {'default'} default - Standard animations and transitions
 * @property {'reduced'} reduced - Minimal or no animations for users who prefer reduced motion
 */
export type ReducedMotion = "default" | "reduced";

/**
 * Interface for the theme context values and functions.
 *
 * @interface ThemeContextType
 */
export interface ThemeContextType {
  /**
   * The current theme setting.
   */
  theme: Theme;

  /**
   * Toggles between themes or sets a specific theme if provided.
   *
   * @param {Theme} [newTheme] - Optional theme to set directly
   * @returns {void}
   */
  toggleTheme: (newTheme?: Theme) => void;

  /**
   * Sets the theme to a specific value.
   *
   * @param {Theme} theme - The theme value to set
   * @returns {void}
   */
  setTheme: (theme: Theme) => void;

  /**
   * The current font size setting.
   */
  fontSize: FontSize;

  /**
   * Sets the font size to a specific value.
   *
   * @param {FontSize} size - The font size value to set
   * @returns {void}
   */
  setFontSize: (size: FontSize) => void;

  /**
   * The current reduced motion setting.
   */
  reducedMotion: ReducedMotion;

  /**
   * Sets the reduced motion preference to a specific value.
   *
   * @param {ReducedMotion} motion - The reduced motion value to set
   * @returns {void}
   */
  setReducedMotion: (motion: ReducedMotion) => void;

  /**
   * Whether the user's system preferences indicate a preference for reduced motion.
   */
  prefersReducedMotion: boolean;

  /**
   * Whether the user's system preferences indicate a preference for high contrast.
   */
  prefersHighContrast: boolean;
}
