import { notFound } from 'next/navigation';
import { getServiceBySlug, GalleryItem, DocumentItem } from '@/lib/api';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return {
    title: `Услуга ${slug}`,
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  
  const response = await getServiceBySlug(slug);
  const service = response.docs[0];

  if (!service) {
    notFound();
  }

  // Получаем URL главной картинки
  const mainImageUrl = typeof service.image === 'object' && service.image?.url
    ? `http://localhost:3000${service.image.url}`
    : null;

  // Получаем галерею
  const galleryImages: (string | null)[] = service.gallery?.map((item: GalleryItem) => {
    if (typeof item === 'object' && item.image?.url) {
      return `http://localhost:3000${item.image.url}`;
    }
    return null;
  }).filter((url): url is string => url !== null) || [];

  // Получаем документы
  const documents: { title: string; url: string; filename: string }[] = service.documents?.map((doc: DocumentItem) => {
    if (typeof doc === 'object' && doc.file?.url) {
      return {
        title: doc.title || 'Документ',
        url: `http://localhost:3000${doc.file.url}`,
        filename: doc.file.filename || 'file',
      };
    }
    return null;
  }).filter((doc): doc is { title: string; url: string; filename: string } => doc !== null) || [];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{service.title}</h1>
      
      {mainImageUrl && (
        <img 
          src={mainImageUrl} 
          alt={service.title} 
          className={styles.mainImage}
        />
      )}

      {service.description && (
        <div 
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: service.description }}
        />
      )}

      {service.price && (
        <div className={styles.priceBlock}>
          <h2>Стоимость</h2>
          <p className={styles.price}>от {service.price} ₽</p>
        </div>
      )}

      {galleryImages.length > 0 && (
        <div className={styles.gallery}>
          <h2>Примеры работ</h2>
          <div className={styles.galleryGrid}>
                        {galleryImages.map((url, index: number) => (
              url && <img key={index} src={url} alt={`Фото ${index + 1}`} />
            ))}
          </div>
        </div>
      )}

      {documents.length > 0 && (
        <div className={styles.documents}>
          <h2>Документы</h2>
          <ul>
            {documents.map((doc, index: number) => (
              <li key={index}>
                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                  📄 {doc.title} ({doc.filename})
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}