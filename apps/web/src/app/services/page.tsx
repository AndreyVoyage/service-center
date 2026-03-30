import { Suspense } from 'react';
import { getServices, getCategories } from '@/lib/api';
import ServicesClient from './ServicesClient';
import styles from './page.module.css';

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  try {
    // Параллельная загрузка данных на сервере
    const [servicesData, categoriesData] = await Promise.all([
      getServices(),
      getCategories(),
    ]);

    return (
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Наши услуги</h1>
          <p className={styles.subtitle}>
            Профессиональный ремонт и обслуживание промышленного холодильного оборудования
          </p>
        </div>

        <Suspense fallback={
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Загрузка услуг...</p>
          </div>
        }>
          <ServicesClient 
            services={servicesData.docs} 
            categories={categoriesData.docs}
            initialCategory={searchParams.category || ''}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('[ServicesPage] Error loading data:', error);
    
    return (
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Наши услуги</h1>
        </div>
        <div className={styles.error}>
          <p>Не удалось загрузить услуги. Пожалуйста, попробуйте позже.</p>
          <p className={styles.errorDetails}>
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }
}