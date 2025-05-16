import React from "react";
import ReactDOM from "react-dom/client";
import { Routes } from "./router";
import "./styles/global.css";
import { ThemeProvider } from "@context/ThemeContext";
import { rootStore, StoreProvider } from "@store/RootStore";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider value={rootStore}>
      <ThemeProvider>
        <Routes />
      </ThemeProvider>
    </StoreProvider>
  </React.StrictMode>
);
