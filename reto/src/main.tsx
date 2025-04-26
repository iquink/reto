import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "@router";
import { RouterProvider } from "react-router";
import { ThemeProvider } from "@context/ThemeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
