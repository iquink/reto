import React, { useState } from "react";
import { Link } from "wouter";
import styles from "./Navbar.module.css";
import { GiHamburgerMenu as MenuIcon } from "react-icons/gi";
import clsx from "clsx";
import SiteLogo from "@assets/img/Logo.svg";
import { useStore } from "@store";
import { observer } from "mobx-react-lite"; // Import observer

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getActiveLinkClass = (isActive: boolean) => {
    return isActive ? `${styles.link} ${styles.active}` : styles.link;
  };

  const handleLogout = async () => {
    await authStore.logout(); // Call the logout action
    window.location.href = "/login"; // Redirect to the login page after logout
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
        <Link to="/" className={(active) => getActiveLinkClass(active)}>
          Home
        </Link>
        {!authStore.isAuthenticated && (
          <>
            <Link to="/login" className={(active) => getActiveLinkClass(active)}>
              Login
            </Link>
            <Link
              to="/register"
              className={(active) => getActiveLinkClass(active)}
            >
              Register
            </Link>
          </>
        )}
        {authStore.isAuthenticated && (
          <>
            <Link
              to="/profile"
              className={(active) => getActiveLinkClass(active)}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className={styles.link} // Add a CSS class for styling
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </>
  );
});

export default Navbar;
