'use client'

import Link from 'next/link';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo}>ZenDesk</Link>
          <div className={styles.navLinks}>
            <Link href="/wallet" className={styles.navLink}>Wallet</Link>
            <Link href="/marketplace" className={styles.navLink}>Marketplace</Link>
            <Link href="/login" className={styles.navLink}>Login</Link>
            <Link href="/signup" className={styles.navLink}>Signup</Link>
          </div>
        </div>
      </nav>
      <main className={styles.main}>{children}</main>
    </div>
  );
}