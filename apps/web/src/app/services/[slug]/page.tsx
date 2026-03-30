import { getServiceBySlug } from '@/lib/api';
import styles from './page.module.css';
import { notFound } from 'next/navigation';

export default async function ServiceDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const { docs } = await getServiceBySlug(slug);
  const service = docs[0];
  
  if (!service) notFound();

  // Для детальной страницы используем card (600x400) или оригинал
  const imageUrl = service.image?.sizes?.card?.url 
    ? `http://localhost:3001${service.image.sizes.card.url}`
    : service.image?.url 
      ? `http://localhost:3001${service.image.url}`
      : null;

  return (
    <div className={styles.container}>
      <h1>{service.title}</h1>
      
      {imageUrl && (
        <div className={styles.mainImage}>
          <img 
            src={imageUrl} 
            alt={service.image?.alt || service.title}
            className={styles.heroImage}
          />
        </div>
      )}

      {service.description && (
        <div className={styles.description} dangerouslySetInnerHTML={{ __html: service.description }} />
      )}
      
      {service.price && (
        <div className={styles.price}>Стоимость: от {service.price} ₽</div>
      )}
    </div>
  );
}