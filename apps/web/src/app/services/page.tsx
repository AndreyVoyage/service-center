// apps/web/src/app/services/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getServices, getCategories, Service, Category } from '@/lib/api';
import ServiceCard from '@/components/ServiceCard';
import styles from './page.module.css';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesData, categoriesData] = await Promise.all([
          getServices(selectedCategory),
          getCategories(),
        ]);
        setServices(servicesData.docs);
        setCategories(categoriesData.docs);
     
      }  catch {
  setError('Не удалось загрузить услуги. Пожалуйста, попробуйте позже.');

      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [selectedCategory]);

  return (
    <div className="container">
      <div className={styles.header}>
        <h1 className={styles.title}>Наши услуги</h1>
        <p className={styles.subtitle}>
          Профессиональный ремонт и обслуживание промышленного холодильного оборудования
        </p>
      </div>

      {/* Filter */}
      <div className={styles.filter}>
        <button
          className={`${styles.filterButton} ${!selectedCategory ? styles.filterActive : ''}`}
          onClick={() => setSelectedCategory('')}
        >
          Все
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.filterButton} ${selectedCategory === cat.id ? styles.filterActive : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Загрузка услуг...</p>
        </div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : services.length === 0 ? (
        <div className={styles.empty}>
          <p>Услуги не найдены</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} showImage />
          ))}
        </div>
      )}
    </div>
  );
}