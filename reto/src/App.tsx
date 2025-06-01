import Navbar from "@components/layout/Navbar/Navbar";
import styles from "./App.module.css";
import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@store";
import { initI18n } from "./i18n/i18n";

const App: React.FC<{ children: React.ReactNode }> = observer(
  ({ children }) => {
    const { authStore } = useStore();
    initI18n();

    // Check authorization when the app loads
    useEffect(() => {
      authStore.checkAuthorization(); // Call the store action directly
    }, [authStore]);

    return (
      <>
        <header className={styles.header}>
          <Navbar />
        </header>
        <div className={styles.app}>{children}</div>
      </>
    );
  }
);

export default App;
