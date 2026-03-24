'use client';

import { HeroData } from '@/lib/api';
import styles from './Hero.module.css';

interface HeroProps {
  hero: HeroData;
}

export default function Hero({ hero }: HeroProps) {
  if (!hero.isActive) return null;

  const backgroundStyle: React.CSSProperties = {};
  
  if (hero.backgroundType === 'image' && hero.backgroundImage) {
        // Получаем URL картинки (с depth=1 backgroundImage приходит как объект)
    const imageUrl = typeof hero.backgroundImage === 'object' && hero.backgroundImage !== null
      ? `${process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000'}${hero.backgroundImage.url}`
      : null;
    if (imageUrl) {
      backgroundStyle.backgroundImage = `url(${imageUrl})`;
      backgroundStyle.backgroundSize = 'cover';
      backgroundStyle.backgroundPosition = 'center';
    }
  } else {
    // CSS класс для цвета
    backgroundStyle.backgroundColor = getColorValue(hero.backgroundColor);
  }

  return (
    <section className={styles.hero} style={backgroundStyle}>
      <div className={styles.overlay}>
        <h1 className={styles.title}>{hero.title}</h1>
        {hero.subtitle && <p className={styles.subtitle}>{hero.subtitle}</p>}
        
        <div className={styles.buttons}>
          <a href={hero.ctaLink} className={styles.primaryButton}>
            {hero.ctaText}
          </a>
          
          {hero.showSecondaryLink && (
            <a href={hero.secondaryLinkHref} className={styles.secondaryLink}>
              {hero.secondaryLinkText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function getColorValue(color?: string): string {
  switch (color) {
    case 'blue': return '#2563EB';
    case 'dark': return '#1f2937';
    case 'white': return '#ffffff';
    default: return '#2563EB';
  }
}