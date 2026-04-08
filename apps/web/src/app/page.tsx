// apps/web/src/app/page.tsx
import Link from 'next/link';
import { getServices, getReviews, getHero, getFooter, getContactForm, waitForCMS, Service, Review, HeroData, FooterData, ContactFormData } from '@/lib/api';
import { getImageUrl } from '@/lib/api';
import ServiceCard from '@/components/ServiceCard';
import ReviewSlider from '@/components/ReviewSlider';

import ContactSection from '@/components/ContactSection';
import styles from './page.module.css';

// ISR - статическая генерация с ревалидацией каждые 60 секунд
export const revalidate = 60;

// Мемоизация для параллельных запросов
const requestCache = new Map<string, Promise<any>>();

const getMemoized = <T,>(key: string, fetcher: () => Promise<T>): Promise<T> => {
  if (requestCache.has(key)) {
    return requestCache.get(key)!;
  }
  const promise = fetcher();
  requestCache.set(key, promise);
  return promise;
};

// Fallback Hero данные
const fallbackHero: HeroData = {
  isActive: true,
  title: 'Ремонт промышленных холодильников 24/7',
  subtitle: 'Срочный выезд мастера в день обращения. Ремонт любой сложности с гарантией до 12 месяцев.',
  backgroundType: 'color',
  backgroundColor: 'blue',
  ctaText: 'Вызвать мастера',
  ctaLink: '/#form',
  showSecondaryLink: true,
  secondaryLinkText: 'Все услуги →',
  secondaryLinkHref: '/services',
};

// Helper function to get background class based on color
function getHeroBackgroundClass(backgroundColor?: string): string {
  switch (backgroundColor) {
    case 'dark':
      return styles['hero-bg-dark'];
    case 'white':
      return styles['hero-bg-white'];
    case 'blue':
    default:
      return styles['hero-bg-blue'];
  }
}

// Dynamic Hero component
function HeroSection({ hero }: { hero: HeroData }) {
  if (!hero.isActive) return null;

  const backgroundImageUrl = hero.backgroundType === 'image' && hero.backgroundImage
    ? getImageUrl(hero.backgroundImage, 'full')
    : null;

  const backgroundClass = hero.backgroundType === 'color'
    ? getHeroBackgroundClass(hero.backgroundColor)
    : '';

  const sectionStyle = backgroundImageUrl
    ? { backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined;

  return (
    <section
      className={`${styles.hero} ${backgroundClass}`}
      style={sectionStyle}
    >
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          {hero.title || fallbackHero.title}
        </h1>
        {hero.subtitle && (
          <p className={styles.heroSubtitle}>{hero.subtitle}</p>
        )}
        <div className={styles.heroActions}>
          <Link href={hero.ctaLink || '#form'} className={styles.heroButton}>
            {hero.ctaText || 'Вызвать мастера'}
          </Link>
          {hero.showSecondaryLink && hero.secondaryLinkText && (
            <Link href={hero.secondaryLinkHref || '/services'} className={styles.heroLink}>
              {hero.secondaryLinkText}
            </Link>
          )}
        </div>
      </div>
      <div className={styles.heroDecoration}></div>
    </section>
  );
}

export default async function Home() {
  // Ожидание готовности CMS (критично при первом запуске)
  await waitForCMS(60000);
  
  // Параллельная загрузка всех данных с мемоизацией
  // НЕ используем .catch() для getServices/getReviews - пусть работает fallback внутри функции
  const [servicesData, reviewsData, heroData, footerData, contactFormData] = await Promise.all([
    getMemoized('services', () => getServices()),
    getMemoized('reviews', () => getReviews()),
    getMemoized('hero', () => getHero().catch(() => fallbackHero)),
    getMemoized('footer', () => getFooter().catch(() => null)),
    getMemoized('contactForm', () => getContactForm().catch(() => null)),
  ]);

  const services = servicesData.docs.slice(0, 6);
  const reviews = reviewsData.docs;
  
  // Debug logging
  console.log('[HomePage] Services loaded:', services.length, servicesData.docs.length > 0 ? '(API)' : '(Fallback)');
  console.log('[HomePage] Reviews loaded:', reviews.length, reviewsData.docs.length > 0 ? '(API)' : '(Fallback/Empty)');
  const hero = heroData || fallbackHero;

  return (
    <>
      {/* Hero Section */}
      <HeroSection hero={hero} />

      {/* Services Section */}
      <section className="section" id="services">
        <div className="container">
          <h2 className="sectionTitle">Наши услуги</h2>
          {services.length > 0 ? (
            <div className={styles.servicesGrid}>
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className={styles.fallback}>
              <p>Услуги временно недоступны. Пожалуйста, позвоните нам.</p>
            </div>
          )}
          <div className={styles.servicesMore}>
            <Link href="/services" className={styles.buttonOutline}>
              Смотреть все услуги
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={`section ${styles.benefits}`}>
        <div className="container">
          <h2 className="sectionTitle">Почему выбирают нас</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>🚀</div>
              <h3 className={styles.benefitTitle}>Быстрый выезд</h3>
              <p className={styles.benefitText}>
                Прибытие мастера в течение 2 часов в пределах МКАД. Работаем 24/7 без выходных.
              </p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>🛡️</div>
              <h3 className={styles.benefitTitle}>Гарантия качества</h3>
              <p className={styles.benefitText}>
                Предоставляем гарантию на все виды работ от 3 до 12 месяцев. Используем оригинальные запчасти.
              </p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>👨‍🔧</div>
              <h3 className={styles.benefitTitle}>Опыт 10+ лет</h3>
              <p className={styles.benefitText}>
                Наши мастера прошли сертификацию и имеют опыт работы с оборудованием всех марок.
              </p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>🔧</div>
              <h3 className={styles.benefitTitle}>Свои запчасти</h3>
              <p className={styles.benefitText}>
                Собственный склад комплектующих. 90% ремонтов выполняем за один визит.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section - ReviewSlider содержит свой section с БЭМ классами */}
      <ReviewSlider reviews={reviews} />

      {/* Form Section - Редактируемый через CMS */}
      {contactFormData?.isActive !== false && (
        <ContactSection data={contactFormData} />
      )}
    </>
  );
}
