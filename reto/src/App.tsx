import Navbar from "@components/layout/Navbar/Navbar";
import styles from "./App.module.css";
import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@store";

const App: React.FC<{ children: React.ReactNode }> = observer(
  ({ children }) => {
    const { authStore } = useStore();

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
