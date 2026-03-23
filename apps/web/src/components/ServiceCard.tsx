// apps/web/src/components/ServiceCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Service } from '@/lib/api';
import styles from './ServiceCard.module.css';

interface ServiceCardProps {
  service: Service;
  showImage?: boolean;
}

export default function ServiceCard({ service, showImage = false }: ServiceCardProps) {
  return (
    <article className={styles.card}>
      {showImage && service.image && (
        <div className={styles.imageWrapper}>
          <Image
            src={`http://localhost:3001${service.image.url}`}
            alt={service.image.alt || service.title}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      
      {!showImage && service.icon && (
        <div className={styles.icon}>{service.icon}</div>
      )}
      
      <div className={styles.content}>
        <h3 className={styles.title}>{service.title}</h3>
        <p className={styles.description}>
          {service.shortDescription || service.description?.slice(0, 100) + '...'}
        </p>
        
        {service.price && (
          <p className={styles.price}>от {service.price.toLocaleString('ru-RU')} ₽</p>
        )}
        
        <div className={styles.actions}>
          <Link href={`/services/${service.slug}`} className={styles.link}>
            Подробнее →
          </Link>
          <Link 
            href={`/?service=${service.slug}`} 
            className={styles.button}
          >
            Заказать
          </Link>
        </div>
      </div>
    </article>
  );
}