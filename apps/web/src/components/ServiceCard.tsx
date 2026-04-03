import { Service, getImageUrl, getGalleryImageUrl } from '@/lib/api';
import styles from './ServiceCard.module.css';
import Link from 'next/link';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  // Получаем первое изображение из gallery или используем image
  const firstGalleryItem = service.gallery?.[0];
  const imageUrl = (firstGalleryItem 
    ? getGalleryImageUrl(firstGalleryItem, 'thumbnail')
    : getImageUrl(service.image, 'thumbnail')) || '/placeholder.jpg';

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img 
          src={imageUrl} 
          alt={firstGalleryItem?.alt || service.image?.alt || service.title} 
          className={styles.image}
          loading="lazy"
        />
      </div>
      <div className={styles.content}>
        <h3>{service.title}</h3>
        <p>{service.shortDescription}</p>
        {service.price && <span className={styles.price}>от {service.price} ₽</span>}
        <Link href={`/services/${service.slug}`} className={styles.link}>
          Подробнее →
        </Link>
      </div>
    </div>
  );
}