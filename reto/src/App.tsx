import Button from "@components/Button/Button";
import Navbar from "@components/layout/Navbar/Navbar";
import { useTheme } from "@context/ThemeContext/";
import styles from "./App.module.css";
import React from "react";
import Input from "@components/Input/Input";

function App({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();

  // Calculate the current effective theme and the next theme
  const effectiveTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  const nextTheme = effectiveTheme === "light" ? "dark" : "light";

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
          style={{ margin: "var(--spacing-sm)", padding: "var(--spacing-sm)" }}
        >
          Switch to {nextTheme} theme
        </Button>
        <Input label="Test" placeholder="Test placeholder" />
        {children}
      </div>
    </>
  );
}

export default App;
