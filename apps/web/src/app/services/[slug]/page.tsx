// apps/web/src/app/services/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getServiceBySlug, getServices } from '@/lib/api';
import RequestForm from '@/components/RequestForm';
import styles from './page.module.css';

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const { docs: services } = await getServices();
    return services.map((service) => ({
      slug: service.slug,
    }));
  } catch {
  return [];
}
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { docs } = await getServiceBySlug(params.slug);
  const service = docs[0];
  
  if (!service) {
    return {
      title: 'Услуга не найдена',
    };
  }

  return {
    title: `${service.title} | ColdService`,
    description: service.shortDescription || service.description.slice(0, 160),
  };
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const { docs } = await getServiceBySlug(params.slug);
  const service = docs[0];

  if (!service) {
    notFound();
  }

  const hasGallery = service.gallery && service.gallery.length > 0;

  return (
    <div className="container">
      <div className={styles.breadcrumbs}>
        <a href="/">Главная</a>
        <span>/</span>
        <a href="/services">Услуги</a>
        <span>/</span>
        <span>{service.title}</span>
      </div>

      <div className={styles.grid}>
        <div className={styles.content}>
          <h1 className={styles.title}>{service.title}</h1>
          
          {service.price && (
            <div className={styles.price}>
              от {service.price.toLocaleString('ru-RU')} ₽
            </div>
          )}

          <div 
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: service.description }}
          />

          {hasGallery && (
            <div className={styles.gallery}>
              <h2 className={styles.galleryTitle}>Примеры работ</h2>
              <div className={styles.galleryGrid}>
                {service.gallery?.map((image, index) => (
                  <div key={index} className={styles.galleryItem}>
                    <Image
                      src={`http://localhost:3001${image.url}`}
                      alt={image.alt || `Фото ${index + 1}`}
                      fill
                      className={styles.galleryImage}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.sidebar}>
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>Заявка на ремонт</h3>
            <p className={styles.formSubtitle}>
              Оставьте заявку на "{service.title}" и мы свяжемся с вами
            </p>
            <RequestForm preselectedService={service.title} />
          </div>

          <div className={styles.infoCard}>
            <h4>Почему мы?</h4>
            <ul>
              <li>✓ Выезд в день обращения</li>
              <li>✓ Гарантия до 12 месяцев</li>
              <li>✓ Оригинальные запчасти</li>
              <li>✓ Бесплатная диагностика</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}