// apps/web/src/components/ReviewSlider.tsx
'use client';

import { useState, useEffect, useCallback, TouchEvent } from 'react';
import Image from 'next/image';
import { Review, Media, getImageUrl } from '@/lib/api';
import styles from './ReviewSlider.module.css';

interface ReviewSliderProps {
  reviews: Review[];
}

export default function ReviewSlider({ reviews }: ReviewSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  }, [reviews.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (reviews.length <= 1) return;
    
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [goToNext, reviews.length]);

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrev();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? styles.starFilled : styles.star}>
        ★
      </span>
    ));
  };

  // Получить инициалы из имени
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Получить URL фото автора
  const getPhotoUrl = (photo: number | Media | undefined | null): string | null => {
    if (!photo) return null;
    if (typeof photo === 'number') return null;
    // Используем thumbnail для аватара (80x80)
    return getImageUrl(photo, 'thumbnail');
  };

  if (reviews.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Пока нет отзывов</p>
      </div>
    );
  }

  return (
    <div className={styles.slider}>
      <div 
        className={styles.container}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className={styles.track}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {reviews.map((review) => {
            const photoUrl = getPhotoUrl(review.photo);
            const initials = getInitials(review.name);
            
            return (
              <div key={review.id} className={styles.slide}>
                <div className={styles.card}>
                  {/* Аватар автора */}
                  <div className={styles.avatar}>
                    {photoUrl ? (
                      <Image
                        src={photoUrl}
                        alt={review.name}
                        width={80}
                        height={80}
                        className={styles.avatarImage}
                      />
                    ) : (
                      <div className={styles.avatarFallback}>
                        {initials}
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.stars}>
                    {renderStars(review.rating)}
                  </div>
                  <p className={styles.text}>"{review.text}"</p>
                  <p className={styles.author}>— {review.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {reviews.length > 1 && (
        <>
          <button 
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={goToPrev}
            aria-label="Previous review"
          >
            ‹
          </button>
          <button 
            className={`${styles.arrow} ${styles.arrowRight}`}
            onClick={goToNext}
            aria-label="Next review"
          >
            ›
          </button>

          <div className={styles.dots}>
            {reviews.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
