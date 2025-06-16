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
import { useTranslation } from "react-i18next";

/**
 * Breadcrumbs navigation component.
 *
 * Renders a list of breadcrumbs based on the application's current navigation state.
 * Uses react-aria-components for accessibility and Wouter for navigation.
 * The last breadcrumb is displayed as plain text to indicate the current page.
 *
 * @component
 * @example
 * // Used within a layout to show navigation path
 * <Breadcrumbs />
 */
export const Breadcrumbs: React.FC = observer(() => {
  /**
   * Access the commonStore to retrieve the current breadcrumbs array.
   */
  const { commonStore } = useStore();
  const { breadcrumbs } = commonStore;
  const { t } = useTranslation();

  return (
    <AriaBreadcrumbs className={styles.breadcrumbs}>
      {breadcrumbs.map(
        (breadcrumb: Instance<typeof BreadcrumbItemModel>, idx: number) => {
          const { path, label, params } = breadcrumb;
          
          return (
            <Breadcrumb key={path} className={styles.item}>
              {/* If it's the last breadcrumb, display it as current */}
              {idx === breadcrumbs.length - 1 ? (
                <span className={styles.current}>
                  {t("breadcrumbs." + label, { id: params?.id })}
                </span>
              ) : (
                <Link to={path} className={styles.link}>
                  {t("breadcrumbs." + label)}
                </Link>
              )}
            </Breadcrumb>
          );
        }
      )}
    </AriaBreadcrumbs>
  );
});
