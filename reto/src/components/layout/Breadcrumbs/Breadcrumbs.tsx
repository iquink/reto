import React from "react";
import styles from "./Breadcrumbs.module.css";
import {
  Breadcrumb,
  Breadcrumbs as AriaBreadcrumbs,
} from "react-aria-components";
import { Link } from "wouter";
import { BreadcrumbItemModel } from "@store/models";
import { Instance } from "mobx-state-tree";
import { useStore } from "@store";
import { observer } from "mobx-react-lite";

export const Breadcrumbs: React.FC = observer(() => {
  const { commonStore } = useStore();

  return (
    <AriaBreadcrumbs className={styles.breadcrumbs}>
      {commonStore.breadcrumbs.map(
        (breadcrumb: Instance<typeof BreadcrumbItemModel>, idx: number) => (
          <Breadcrumb key={breadcrumb.path} className={styles.item}>
            {/* If it's the last breadcrumb, display it as current */}
            {idx === commonStore.breadcrumbs.length - 1 ? (
              <span className={styles.current}>{breadcrumb.label}</span>
            ) : (
              <Link to={breadcrumb.path} className={styles.link}>
                {breadcrumb.label}
              </Link>
            )}
          </Breadcrumb>
        )
      )}
    </AriaBreadcrumbs>
  );
});
