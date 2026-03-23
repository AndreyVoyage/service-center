// apps/web/src/components/Footer.tsx
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.section}>
            <h3 className={styles.title}>❄️ ColdService</h3>
            <p className={styles.text}>
              Профессиональный ремонт промышленного холодильного оборудования с 2014 года
            </p>
          </div>
          
          <div className={styles.section}>
            <h4 className={styles.subtitle}>Контакты</h4>
            <address className={styles.address}>
              <p>г. Москва, ул. Примерная, д. 123</p>
              <p>
                <a href="tel:+74951234567" className={styles.link}>
                  +7 (495) 123-45-67
                </a>
              </p>
              <p>
                <a href="mailto:info@coldservice.ru" className={styles.link}>
                  info@coldservice.ru
                </a>
              </p>
            </address>
          </div>

          <div className={styles.section}>
            <h4 className={styles.subtitle}>Навигация</h4>
            <nav className={styles.nav}>
              <Link href="/" className={styles.link}>Главная</Link>
              <Link href="/services" className={styles.link}>Услуги</Link>
            </nav>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} ColdService. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}