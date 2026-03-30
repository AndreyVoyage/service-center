'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ServiceCard from '@/components/ServiceCard';
import { Service, Category } from '@/lib/api';
import styles from './page.module.css';

interface ServicesClientProps {
  services: Service[];
  categories: Category[];
  initialCategory?: string;
}

export default function ServicesClient({ 
  services, 
  categories, 
  initialCategory = '' 
}: ServicesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (categoryId) {
        params.set('category', categoryId);
      } else {
        params.delete('category');
      }
      router.push(`/services?${params.toString()}`, { scroll: false });
    });
  };

  // ✅ ИСПРАВЛЕНО: Type guard для category (может быть string | Category)
  const filteredServices = selectedCategory
    ? services.filter(s => {
        // category может быть строкой ID или объектом Category
        if (!s.category) return false;
        
        const categoryId = typeof s.category === 'string' 
          ? s.category 
          : s.category.id;
          
        return categoryId === selectedCategory;
      })
    : services;

  return (
    <>
      {/* Filter */}
      <div className={styles.filter}>
        <button
          className={`${styles.filterButton} ${!selectedCategory ? styles.filterActive : ''}`}
          onClick={() => handleCategoryChange('')}
        >
          Все
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.filterButton} ${selectedCategory === cat.id ? styles.filterActive : ''}`}
            onClick={() => handleCategoryChange(cat.id)}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Loading Overlay */}
      {isPending && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}

      {/* Services Grid */}
      <div className={`${styles.grid} ${isPending ? styles.gridLoading : ''}`}>
        {filteredServices.length === 0 ? (
          <div className={styles.empty}>
            <p>Услуги не найдены</p>
          </div>
        ) : (
          filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))
        )}
      </div>
    </>
  );
}