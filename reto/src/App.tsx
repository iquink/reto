import Button from "@components/Button/Button";
import Header from "@components/layout/Header";
import { useTheme } from "@context/ThemeContext/";
import { Outlet } from "react-router";
import styles from "./App.module.css";

function App() {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <Header />
      <div data-theme={theme} className={styles.app}>
        <h1>Design System (Green Palette)</h1>
        <Button variant="primary" style={{ margin: "var(--spacing-sm)" }}>
          Primary Button
        </Button>
        <Button variant="secondary" style={{ margin: "var(--spacing-sm)" }}>
          Secondary Button
        </Button>
        <button
          onClick={toggleTheme}
          style={{ margin: "var(--spacing-sm)", padding: "var(--spacing-sm)" }}
        >
          Switch to {theme === "light" ? "dark" : "light"} theme
        </button>
      </div>
      <Outlet />
    </>
  );
}

export default App;
