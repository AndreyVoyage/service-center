// apps/web/src/components/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          ❄️ ColdService
        </Link>

        <button 
          className={styles.burger} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className={`${styles.burgerLine} ${isMenuOpen ? styles.open : ''}`}></span>
          <span className={`${styles.burgerLine} ${isMenuOpen ? styles.open : ''}`}></span>
          <span className={`${styles.burgerLine} ${isMenuOpen ? styles.open : ''}`}></span>
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <Link href="/" className={styles.navLink} onClick={closeMenu}>
            Главная
          </Link>
          <Link href="/services" className={styles.navLink} onClick={closeMenu}>
            Услуги
          </Link>
          <a href="tel:+74951234567" className={styles.phone}>
            📞 +7 (495) 123-45-67
          </a>
        </nav>
      </div>
    </header>
  );
}