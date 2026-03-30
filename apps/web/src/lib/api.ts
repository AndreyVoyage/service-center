// apps/web/src/lib/api.ts

const rawUrl = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';
const API_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

console.log('[API] CMS URL configured:', API_URL);

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price?: number;
  icon?: string;
  image?: Media;
  category?: Category | string; // может быть объектом или ID строкой
  gallery?: Media[];
}

export interface Category {
  id: string;
  title: string;
  slug: string;
}

export interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  createdAt: string;
}

export interface Media {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: {
    thumbnail?: {
      url: string;
      width?: number;
      height?: number;
    };
    card?: {
      url: string;
      width?: number;
      height?: number;
    };
    small?: {
      url: string;
      width?: number;
      height?: number;
    };
    medium?: {
      url: string;
      width?: number;
      height?: number;
    };
    large?: {
      url: string;
      width?: number;
      height?: number;
    };
  };
}

export interface HeroData {
  id?: string | number;
  isActive: boolean;
  title: string;
  subtitle?: string;
  backgroundType: 'image' | 'color';
  backgroundImage?: Media | string;
  backgroundColor?: 'blue' | 'dark' | 'white';
  ctaText: string;
  ctaLink: string;
  showSecondaryLink: boolean;
  secondaryLinkText?: string;
  secondaryLinkHref?: string;
}

export interface FormSubmission {
  name: string;
  phone: string;
  message?: string;
  service?: string;
  equipmentType?: string;
}

async function fetchAPI<T>(
  endpoint: string, 
  options?: RequestInit & { next?: { revalidate?: number; tags?: string[] } }
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  console.log(`[API] Fetching: ${url}`);

  try {
    // Определяем параметры кэширования
    // Если передан next.revalidate - используем next, иначе no-store
    const hasRevalidate = options?.next?.revalidate !== undefined;
    
    const fetchOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    };

    // Убираем конфликт: если есть revalidate, не используем cache: no-store
    if (hasRevalidate) {
      // @ts-ignore - next специфичен для Next.js
      fetchOptions.next = options?.next;
      delete fetchOptions.cache; // удаляем cache, если есть revalidate
    } else {
      // По умолчанию no-store для динамических данных
      fetchOptions.cache = options?.cache ?? 'no-store';
      delete fetchOptions.next; // удаляем next, если нет revalidate
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`[API] HTTP Error ${response.status}:`, errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[API] Success: ${url} - Status: ${response.status}`);
    return data;
  } catch (error) {
    console.error(`[API] Error fetching ${url}:`, error);
    throw error;
  }
}

// Динамическое получение услуг (без кэширования или с revalidate)
export async function getServices(category?: string): Promise<{ docs: Service[] }> {
  const params = new URLSearchParams();
  params.append('limit', '100');
  if (category) params.append('where[category][equals]', category);

  return fetchAPI<{ docs: Service[] }>(`/services?${params.toString()}`, {
    next: { revalidate: 60 }, // ISR - обновление каждые 60 сек
  });
}

// Получение услуг по slug (для статических страниц)
export async function getServiceBySlug(slug: string): Promise<{ docs: Service[] }> {
  return fetchAPI<{ docs: Service[] }>(`/services?where[slug][equals]=${encodeURIComponent(slug)}`, {
    next: { revalidate: 60 },
  });
}

// Получение категорий
export async function getCategories(): Promise<{ docs: Category[] }> {
  return fetchAPI<{ docs: Category[] }>(`/categories?limit=100`, {
    next: { revalidate: 60 }, // ISR
  });
}

// Получение отзывов
export async function getReviews(): Promise<{ docs: Review[] }> {
  return fetchAPI<{ docs: Review[] }>(`/reviews?limit=20&sort=-createdAt`, {
    next: { revalidate: 60 },
  });
}

// Получение Hero (глобальные настройки)
export async function getHero(): Promise<HeroData | null> {
  const endpoint = '/globals/hero';
  console.log(`[API] getHero() called - fetching from ${API_URL}${endpoint}`);

  try {
    const response = await fetchAPI<HeroData>(endpoint, {
      cache: 'no-store', // Hero может меняться часто, не кэшируем
    });

    console.log('[API] getHero() response:', JSON.stringify(response, null, 2));

    if (!response || (!response.id && !response.title)) {
      console.warn('[API] getHero() - no hero data in response');
      return null;
    }

    console.log('[API] getHero() - hero loaded successfully:', {
      title: response.title,
      isActive: response.isActive,
    });

    return response;
  } catch (error) {
    console.error('[API] getHero() failed:', error);
    return null;
  }
}

// Отправка формы (всегда no-store)
export async function submitForm(data: FormSubmission): Promise<{ doc: FormSubmission }> {
  return fetchAPI('/form-submissions', {
    method: 'POST',
    body: JSON.stringify({ data }),
    cache: 'no-store', // POST запросы не кэшируются
  });
}

// Вспомогательная функция для получения полного URL медиа
export function getMediaUrl(media: Media | string | undefined | null): string {
  if (!media) return '';
  if (typeof media === 'string') return media;
  if (media.url) {
    // Если URL начинается с /api, добавляем базовый URL CMS
    if (media.url.startsWith('/api')) {
      return `${rawUrl}${media.url}`;
    }
    return media.url;
  }
  return '';
}

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

// Вспомогательная функция для получения URL изображения
export function getImageUrl(
  media: Media | undefined | null, 
  size: 'thumbnail' | 'card' | 'full' = 'full'
): string | null {
  if (!media) return null;
  
  // Если запрошен full или нет такого размера в sizes — возвращаем оригинал
  if (size === 'full') {
    if (media.url) {
      return media.url.startsWith('http') ? media.url : `${CMS_URL}${media.url}`;
    }
    return null;
  }
  
  // Проверяем sizes для thumbnail и card
  const sizedUrl = media.sizes?.[size]?.url;
  if (sizedUrl) {
    return `${CMS_URL}${sizedUrl}`;
  }
  
  // Fallback на оригинал если размер не найден
  if (media.url) {
    return media.url.startsWith('http') ? media.url : `${CMS_URL}${media.url}`;
  }
  
  return null;
}