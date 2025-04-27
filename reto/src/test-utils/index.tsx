import React, { ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "@context/ThemeContext"; // Adjust the path to your ThemeContext

const customRender = (
  ui: ReactNode,
  options?: Omit<RenderOptions, "wrapper">
) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options);
};

// Re-export everything from @testing-library/react
export {
  render as baseRender,
  screen,
  fireEvent,
  waitFor,
  act,
  within,
  cleanup,
} from "@testing-library/react";

// Override render method
export { customRender as render };
