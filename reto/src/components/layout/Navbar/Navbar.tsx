import React, { useState } from "react";
import { Link } from "wouter";
import styles from "./Navbar.module.css";
import { GiHamburgerMenu as MenuIcon } from "react-icons/gi";
import clsx from "clsx";

const Navbar: React.FC = () => {
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getActiveLinkClass = (isActive: boolean) => {
    return isActive ? `${styles.link} ${styles.active}` : styles.link;
  };

  return (
    <>
      <div className={styles.logo}>
        <Link to="/">MyApp</Link>
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
        <Link to="/login" className={(active) => getActiveLinkClass(active)}>
          Login
        </Link>
      </nav>
    </>
  );
};

export default Navbar;
