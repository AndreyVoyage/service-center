// apps/web/src/components/Footer.tsx
import Link from 'next/link';
import { getFooter, getImageUrl } from '@/lib/api';
import styles from './Footer.module.css';

// Fallback данные если CMS недоступен
const fallbackFooter = {
  companyName: '❄️ ColdService',
  description: 'Профессиональный ремонт промышленного холодильного оборудования с 2014 года',
  contacts: {
    email: 'info@coldservice.ru',
    phone: '+7 (495) 123-45-67',
    address: 'г. Москва, ул. Примерная, д. 123',
  },
  navigationColumns: [
    {
      title: 'Навигация',
      links: [
        { label: 'Главная', href: '/', isActive: true },
        { label: 'Услуги', href: '/services', isActive: true },
      ],
    },
  ],
  copyright: 'ColdService. Все права защищены.',
};

// Иконки социальных сетей
const socialIcons: Record<string, string> = {
  facebook: '📘',
  instagram: '📷',
  telegram: '✈️',
  whatsapp: '💬',
  vk: '🔷',
  youtube: '▶️',
};

export default async function Footer() {
  // Получаем данные из CMS
  const footer = await getFooter();
  
  // Используем fallback если CMS недоступен
  const data = footer || fallbackFooter;
  
  const logoUrl = data.logo ? getImageUrl(data.logo, 'thumbnail') : null;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Колонка с логотипом и описанием */}
          <div className={styles.section}>
            <h3 className={styles.title}>
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={data.companyName || 'Logo'} 
                  className={styles.logo}
                  style={{ maxHeight: '40px', width: 'auto' }}
                />
              ) : (
                data.companyName || fallbackFooter.companyName
              )}
            </h3>
            <p className={styles.text}>
              {data.description || fallbackFooter.description}
            </p>
            
            {/* Социальные сети */}
            {data.socialLinks && data.socialLinks.length > 0 && (
              <div className={styles.socialLinks}>
                {data.socialLinks
                  .filter(link => link.isActive !== false)
                  .map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      title={link.platform}
                    >
                      {socialIcons[link.platform] || '🔗'}
                    </a>
                  ))}
              </div>
            )}
          </div>
          
          {/* Контакты */}
          {data.contacts && (
            <div className={styles.section}>
              <h4 className={styles.subtitle}>Контакты</h4>
              <address className={styles.address}>
                {data.contacts.address && <p>{data.contacts.address}</p>}
                {data.contacts.phone && (
                  <p>
                    <a href={`tel:${data.contacts.phone.replace(/\s/g, '')}`} className={styles.link}>
                      {data.contacts.phone}
                    </a>
                  </p>
                )}
                {data.contacts.email && (
                  <p>
                    <a href={`mailto:${data.contacts.email}`} className={styles.link}>
                      {data.contacts.email}
                    </a>
                  </p>
                )}
              </address>
            </div>
          )}

          {/* Навигационные колонки */}
          {(data.navigationColumns || fallbackFooter.navigationColumns)?.map((column, colIndex) => (
            <div key={colIndex} className={styles.section}>
              <h4 className={styles.subtitle}>{column.title || 'Навигация'}</h4>
              <nav className={styles.nav}>
                {column.links
                  ?.filter(link => link.isActive !== false)
                  .map((link, linkIndex) => (
                    <Link key={linkIndex} href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  ))}
              </nav>
            </div>
          ))}
        </div>
        
        {/* Нижняя часть футера */}
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} {data.copyright || fallbackFooter.copyright}</p>
          
          {/* Юридические ссылки */}
          {data.showLegalLinks && data.legalLinks && data.legalLinks.length > 0 && (
            <nav className={styles.legalLinks}>
              {data.legalLinks.map((link, index) => (
                <Link key={index} href={link.href} className={styles.legalLink}>
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
}
