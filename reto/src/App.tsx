import Button from "@components/Button/Button";
import Header from "@components/layout/Header";
import { useTheme } from "@context/ThemeContext/";
import { Outlet } from "react-router";
import styles from "./App.module.css";

function App() {
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
      <Header />
      <div className={styles.app}>
        <h1>Design System (Green Palette)</h1>
        <Button variant="primary" style={{ margin: "var(--spacing-sm)" }}>
          Primary Button
        </Button>
        <Button variant="secondary" style={{ margin: "var(--spacing-sm)" }}>
          Secondary Button
        </Button>
        <Button
          variant="primary"
          onClick={() => toggleTheme()}
          style={{ margin: "var(--spacing-sm)", padding: "var(--spacing-sm)" }}
        >
          Switch to {nextTheme} theme
        </Button>
      </div>
      <Outlet />
    </>
  );
}

export default App;
