// apps/web/src/app/page.tsx
import Link from 'next/link';
import { getServices, getReviews, Service, Review } from '@/lib/api';
import ServiceCard from '@/components/ServiceCard';
import ReviewSlider from '@/components/ReviewSlider';
import RequestForm from '@/components/RequestForm';
import styles from './page.module.css';

export const revalidate = 60;

export default async function Home() {
  let services: Service[] = [];  // ← явная типизация
  let reviews: Review[] = [];    // ← явная типизация
  
  try {
    const servicesData = await getServices();
    services = servicesData.docs.slice(0, 6);
  } catch (error) {
    console.error('Failed to fetch services:', error);
  }

  try {
    const reviewsData = await getReviews();
    reviews = reviewsData.docs;
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
  }

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
      {/* Hero Section */}
      <section className={styles.hero}>
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