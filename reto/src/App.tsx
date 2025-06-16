import Navbar from "@components/layout/Navbar/Navbar";
import styles from "./App.module.css";
import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@store";
import { Breadcrumb, Breadcrumbs } from "react-aria-components";
import { Link } from "wouter";
import { BreadcrumbItemModel } from "@store/models";
import { Instance } from "mobx-state-tree";

const App: React.FC<{ children: React.ReactNode }> = observer(
  ({ children }) => {
    const { authStore, commonStore } = useStore();
  

    // Check authorization when the app loads
    useEffect(() => {
      authStore.checkAuthorization(); // Call the store action directly
    }, [authStore]);

    return (
      <>
        <header className={styles.header}>
          <Navbar />
        </header>
        <Breadcrumbs>
          {commonStore.breadcrumbs.map((breadcrumb: Instance<typeof BreadcrumbItemModel>) => (
            <Breadcrumb key={breadcrumb.path}>
              <Link
                to={breadcrumb.path}
                className={styles.breadcrumbLink}
              >
                {breadcrumb.label}
              </Link>
            </Breadcrumb>
          ))}
        </Breadcrumbs>
        <div className={styles.app}>{children}</div>
      </>
    );
  }
);

export default App;
