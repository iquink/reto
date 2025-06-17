import React from "react";
import ReactDOM from "react-dom/client";
import { Routes } from "./router";
import "./styles/global.css";
import { ThemeProvider } from "@context/ThemeContext";
import { rootStore, StoreProvider } from "@store/RootStore";
import "./i18n/i18n";
import { getCsrfToken, setCsrfToken } from "@api/index";

/**
 * Main entry point for the React application.
 * Initializes the application, sets up global styles, and renders the main component.
 *
 * @module main
 */
// restore CSRF token from localStorage at the start of the application
const storedToken = getCsrfToken();
if (storedToken) {
  setCsrfToken(storedToken);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider value={rootStore}>
      <ThemeProvider>
        <Routes />
      </ThemeProvider>
    </StoreProvider>
  </React.StrictMode>
);
