// apps/web/src/app/page.tsx
import Link from 'next/link';
import { getServices, getReviews, getHero, Service, Review, HeroData, Media } from '@/lib/api';
import ServiceCard from '@/components/ServiceCard';
import ReviewSlider from '@/components/ReviewSlider';
import RequestForm from '@/components/RequestForm';
import styles from './page.module.css';


// Отключаем статическую генерацию и кэширование для dev-режима
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

// Helper function to get background image URL
function getBackgroundImageUrl(backgroundImage: Media | string | undefined): string | null {
  if (!backgroundImage) return null;
  if (typeof backgroundImage === 'string') return backgroundImage;
  return backgroundImage.url || null;
}

// Default Hero component when API fails or returns no data
function DefaultHero() {
  console.log('[Hero] Rendering DEFAULT hero (API failed or no data)');
  return (
    <section className={`${styles.hero} ${styles['hero-bg-blue']}`}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Ремонт промышленных холодильников 24/7
        </h1>
        <p className={styles.heroSubtitle}>
          Срочный выезд мастера в день обращения.
          Ремонт любой сложности с гарантией до 12 месяцев.
        </p>
        <div className={styles.heroActions}>
          <Link href="#form" className={styles.heroButton}>
            Вызвать мастера
          </Link>
          <Link href="/services" className={styles.heroLink}>
            Все услуги →
          </Link>
        </div>
      </div>
      <div className={styles.heroDecoration}></div>
    </section>
  );
}

// Dynamic Hero component
function DynamicHero({ hero }: { hero: HeroData }) {
  // If hero is inactive, don't render
  if (!hero.isActive) {
    console.log('[Hero] Hero is inactive (isActive = false)');
    return null;
  }

  const backgroundImageUrl = hero.backgroundType === 'image'
    ? getBackgroundImageUrl(hero.backgroundImage)
    : null;

  const backgroundClass = hero.backgroundType === 'color'
    ? getHeroBackgroundClass(hero.backgroundColor)
    : '';

  const sectionStyle = backgroundImageUrl
    ? { backgroundImage: `url(${process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001'}${backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined;

  console.log('[Hero] Rendering DYNAMIC hero from CMS:', {
    title: hero.title,
    backgroundType: hero.backgroundType,
    backgroundColor: hero.backgroundColor,
    hasBackgroundImage: !!backgroundImageUrl,
    isActive: hero.isActive,
  });

  return (
    <section
      className={`${styles.hero} ${backgroundClass}`}
      style={sectionStyle}
    >
      {/* Индикатор CMS Connected (только для отладки) */}
      <div className={styles.cmsIndicator} title="Данные загружены из CMS">
        <span className={styles.cmsIndicatorDot}></span>
        CMS Connected
      </div>

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          {hero.title || 'Ремонт промышленных холодильников 24/7'}
        </h1>
        {hero.subtitle && (
          <p className={styles.heroSubtitle}>
            {hero.subtitle}
          </p>
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
  console.log('\n========== PAGE RENDER START ==========');
  console.log('[Page] Fetching data from CMS...');
  console.log('[Page] CMS URL:', process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001');

  let services: Service[] = [];
  let reviews: Review[] = [];
  let hero: HeroData | null = null;

  try {
    const servicesData = await getServices();
    services = servicesData.docs.slice(0, 6);
    console.log(`[Page] Loaded ${services.length} services`);
  } catch (error) {
    console.error('[Page] Failed to fetch services:', error);
  }

  try {
    const reviewsData = await getReviews();
    reviews = reviewsData.docs;
    console.log(`[Page] Loaded ${reviews.length} reviews`);
  } catch (error) {
    console.error('[Page] Failed to fetch reviews:', error);
  }

  try {
    hero = await getHero();
    console.log('[Page] Hero data loaded:', hero ? 'SUCCESS' : 'NULL');
    if (hero) {
      console.log('[Page] Hero details:', {
        title: hero.title,
        isActive: hero.isActive,
        backgroundType: hero.backgroundType,
        backgroundColor: hero.backgroundColor,
      });
    }
  } catch (error) {
    console.error('[Page] Failed to fetch hero:', error);
  }

  console.log('========== PAGE RENDER END ==========\n');

  const equipmentTypes = [
    'Промышленный холодильник',
    'Морозильная камера',
    'Холодильная витрина',
    'Ларь морозильный',
    'Кондитерский шкаф',
    'Холодильный агрегат',
  ];

  return (
    <>
      {/* Hero Section - Dynamic from CMS */}
      {hero ? <DynamicHero hero={hero} /> : <DefaultHero />}

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

      {/* Reviews Section */}
      <section className="section">
        <div className="container">
          <h2 className="sectionTitle">Отзывы клиентов</h2>
          <ReviewSlider reviews={reviews} />
        </div>
      </section>

      {/* Form Section */}
      <section className={`section ${styles.formSection}`} id="form">
        <div className="container">
          <div className={styles.formGrid}>
            <div className={styles.formInfo}>
              <h2 className={styles.formTitle}>Оставить заявку</h2>
              <p className={styles.formText}>
                Заполните форму, и мы перезвоним вам в течение 15 минут для уточнения деталей и согласования времени выезда мастера.
              </p>
              <ul className={styles.formList}>
                <li>✓ Бесплатная диагностика при ремонте</li>
                <li>✓ Прозрачное ценообразование</li>
                <li>✓ Официальный договор</li>
              </ul>
            </div>
            <div className={styles.formWrapper}>
              <RequestForm equipmentTypes={equipmentTypes} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
