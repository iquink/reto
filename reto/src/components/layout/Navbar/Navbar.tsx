import React, { useState } from "react";
import { Link } from "wouter";
import styles from "./Navbar.module.css";
import { GiHamburgerMenu as MenuIcon } from "react-icons/gi";
import clsx from "clsx";
import SiteLogo from "@assets/img/Logo.svg";
import { useStore } from "@store";
import { observer } from "mobx-react-lite"; // Import observer
import { Button } from "react-aria-components";
import { Select } from "@components/index";
import { Switch } from "@components";
import { useTheme } from "@context/ThemeContext/hooks";
import { US, RU, FI } from "@assets/index";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

const Navbar: React.FC = observer(() => {
  /**
   * Navbar component that provides navigation links to different pages.
   *
   * @component
   * @example
   * return (
   *   <Navbar />
   * )
   */
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authStore, settingsStore } = useStore();

  const { theme, toggleTheme } = useTheme();

  const { t } = useTranslation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getActiveLinkClass = (isActive: boolean) => {
    return isActive ? `${styles.link} ${styles.active}` : styles.link;
  };

  const handleLogout = async () => {
    await authStore.logout();
  };

  return (
    <>
      <div className={styles.logo}>
        <Link to="/">
          <img
            src={SiteLogo}
            alt={t("navbar.labels.logo")}
            className={styles.logoImage}
          />
        </Link>
      </div>

      <button
        className={styles.menuButton}
        onClick={toggleMenu}
        aria-label={t("navbar.labels.toggleMenu")}
      >
        <MenuIcon size={24} />
      </button>

      <nav className={clsx(styles.nav, { [styles.navOpen]: isMenuOpen })}>
        <Link
          to="/"
          className={(active) => getActiveLinkClass(active)}
          onClick={() => setIsMenuOpen(false)}
        >
          {t("navbar.home")}
        </Link>
        {!authStore.isAuthenticated && (
          <>
            <Link
              to="/login"
              onClick={() => {
                setIsMenuOpen(false);
              }}
              className={(active) => getActiveLinkClass(active)}
            >
              {t("navbar.login")}
            </Link>
            <Link
              to="/register"
              onClick={() => {
                setIsMenuOpen(false);
              }}
              className={(active) => getActiveLinkClass(active)}
            >
              {t("navbar.register")}
            </Link>
          </>
        )}
        {authStore.isAuthenticated && (
          <>
            <Link
              to="/issues"
              onClick={() => {
                setIsMenuOpen(false);
              }}
              className={(active) => getActiveLinkClass(active)}
            >
              {t("navbar.issues")}
            </Link>
            <Link
              to="/profile"
              onClick={() => {
                setIsMenuOpen(false);
              }}
              className={(active) => getActiveLinkClass(active)}
            >
              {t("navbar.profile")}
            </Link>
            <Button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className={styles.logoutButton}
            >
              {t("navbar.logout")}
            </Button>
          </>
        )}
        <div className={styles.controlsRow}>
          <Select
            name="language"
            aria-label={t("navbar.labels.selectLanguage")}
            onSelectionChange={(value) => {
              i18next.changeLanguage(value as string).then(() => {
                settingsStore.setLanguage(value as string);
              });
            }}
            defaultSelectedKey={i18next.language}
            options={[
              {
                value: "en-US",
                label: "English",
                icon: <img src={US} alt="English" />,
              },
              {
                value: "ru-RU",
                label: "Русский",
                icon: <img src={RU} alt="Русский" />,
              },
              {
                value: "fi-FI",
                label: "Suomi",
                icon: <img src={FI} alt="Suomi" />,
              },
            ]}
            className={styles.languageSelect}
          />
          <Switch
            aria-label={t("navbar.labels.toggleTheme")}
            isDisabled={false}
            isThemeSwitch
            onChange={() => toggleTheme()}
            isSelected={theme === "dark"}
          />
        </div>
      </nav>
    </>
  );
});

export default Navbar;
