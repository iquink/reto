import React from "react";
import ReactDOM from "react-dom/client";
import { Routes } from "./router";
import "./styles/global.css";
import { ThemeProvider } from "@context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <Routes />
    </ThemeProvider>
  </React.StrictMode>
);
