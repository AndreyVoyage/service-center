import Link from 'next/link';
import { Service } from '@/lib/api';
import styles from './ServiceCard.module.css';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  // Получаем URL картинки (теперь это объект с url)
  const imageUrl = typeof service.image === 'object' && service.image?.url
    ? `http://localhost:3000${service.image.url}`
    : null;

  return (
    <div className={styles.card}>
      {imageUrl && (
        <div className={styles.imageWrapper}>
          <img 
            src={imageUrl} 
            alt={service.title} 
            className={styles.image}
          />
        </div>
      )}
      
      <div className={styles.content}>
        <h3 className={styles.title}>{service.title}</h3>
        
        {service.shortDescription && (
          <p className={styles.description}>{service.shortDescription}</p>
        )}
        
        {service.price && (
          <div className={styles.price}>от {service.price} ₽</div>
        )}
        
        <Link href={`/services/${service.slug}`} className={styles.link}>
          Подробнее →
        </Link>
      </div>
    </div>
  );
}