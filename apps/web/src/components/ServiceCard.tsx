import { Service } from '@/lib/api';
import styles from './ServiceCard.module.css';
import Link from 'next/link';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  // Берем thumbnail для карточки (300x200), если нет - оригинал
  const imageUrl = service.image?.sizes?.thumbnail?.url 
    ? `http://localhost:3001${service.image.sizes.thumbnail.url}`
    : service.image?.url 
      ? `http://localhost:3001${service.image.url}`
      : '/placeholder.jpg';

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img 
          src={imageUrl} 
          alt={service.image?.alt || service.title} 
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