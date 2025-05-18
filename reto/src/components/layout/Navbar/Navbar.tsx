import React, { useState } from "react";
import { Link } from "wouter";
import styles from "./Navbar.module.css";
import { GiHamburgerMenu as MenuIcon } from "react-icons/gi";
import clsx from "clsx";
import SiteLogo from "@assets/img/Logo.svg";
import { useStore } from "@store";
import { observer } from "mobx-react-lite"; // Import observer
import { Button } from "react-aria-components";
import { Switch } from "@components";
import { useTheme } from "@context/ThemeContext/hooks";

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
  const { authStore } = useStore();

  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getActiveLinkClass = (isActive: boolean) => {
    return isActive ? `${styles.link} ${styles.active}` : styles.link;
  };

  const handleLogout = async () => {
    await authStore.logout(); // Call the logout action
  };

  return (
    <>
      <div className={styles.logo}>
        <Link to="/">
          <img src={SiteLogo} alt="Reto Logo" className={styles.logoImage} />
        </Link>
      </div>

      <button
        className={styles.menuButton}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <MenuIcon size={24} />
      </button>

      <nav className={clsx(styles.nav, { [styles.navOpen]: isMenuOpen })}>
        <Switch
          aria-label="Toggle Theme"
          isDisabled={false}
          isThemeSwitch
          onChange={() => toggleTheme()}
          isSelected={theme === "dark"}
        />
        <Link
          to="/"
          className={(active) => getActiveLinkClass(active)}
          onClick={() => setIsMenuOpen(false)}
        >
          Home
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
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => {
                setIsMenuOpen(false);
              }}
              className={(active) => getActiveLinkClass(active)}
            >
              Register
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
              Issues
            </Link>
            <Link
              to="/profile"
              onClick={() => {
                setIsMenuOpen(false);
              }}
              className={(active) => getActiveLinkClass(active)}
            >
              Profile
            </Link>
            <Button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className={styles.logoutButton} // Add a CSS class for styling
            >
              Logout
            </Button>
          </>
        )}
      </nav>
    </>
  );
});

export default Navbar;
