import Button from "@components/Button/Button";
import Navbar from "@components/layout/Navbar/Navbar";
import { useTheme } from "@context/ThemeContext/";
import styles from "./App.module.css";
import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@store";

const App: React.FC<{ children: React.ReactNode }> = observer(
  ({ children }) => {
    const { theme, toggleTheme } = useTheme();
    const { authStore } = useStore();

    // Calculate the current effective theme and the next theme
    const effectiveTheme =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;

    const nextTheme = effectiveTheme === "light" ? "dark" : "light";

    // Check authorization when the app loads
    useEffect(() => {
      authStore.checkAuthorization(); // Call the store action directly
    }, [authStore]);

    return (
      <>
        <header className={styles.header}>
          <Navbar />
        </header>
        <div className={styles.app}>
          <h1>Temp page</h1>
          <Button variant="primary" style={{ margin: "var(--spacing-sm)" }}>
            Primary Button
          </Button>
          <Button variant="secondary" style={{ margin: "var(--spacing-sm)" }}>
            Secondary Button
          </Button>
          <Button
            onClick={() => toggleTheme()}
            style={{
              margin: "var(--spacing-sm)",
              padding: "var(--spacing-sm)",
            }}
          >
            Switch to {nextTheme} theme
          </Button>
          {children}
        </div>
      </>
    );
  }
);

export default App;
