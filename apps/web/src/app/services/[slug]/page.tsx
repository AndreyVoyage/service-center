import { getServiceBySlug, getImageUrl, getGalleryImageUrl } from '@/lib/api';
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

  // Получаем главное изображение: первое из gallery или image
  const firstGalleryItem = service.gallery?.[0];
  const mainImageUrl = firstGalleryItem 
    ? getGalleryImageUrl(firstGalleryItem, 'card')
    : getImageUrl(service.image, 'card');

  return (
    <div className={styles.container}>
      <h1>{service.title}</h1>
      
      {mainImageUrl && (
        <div className={styles.mainImage}>
          <img 
            src={mainImageUrl} 
            alt={firstGalleryItem?.alt || service.image?.alt || service.title}
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

      {/* Галерея */}
      {service.gallery && service.gallery.length > 0 && (
        <div className={styles.gallery}>
          <h2>Галерея</h2>
          <div className={styles.galleryGrid}>
            {service.gallery.map((item, index) => {
              const url = getGalleryImageUrl(item, 'card');
              if (!url) return null;
              return (
                <div key={item.id || index} className={styles.galleryItem}>
                  <img 
                    src={url} 
                    alt={item.alt || `${service.title} - ${index + 1}`}
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}