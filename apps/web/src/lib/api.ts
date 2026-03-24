// apps/web/src/lib/api.ts
const API_URL = `${process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000'}/api`;

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
  category?: Category;
  gallery?: GalleryItem[];
  documents?: DocumentItem[];
}

export interface GalleryItem {
  id: string;
  image: Media;
  alt?: string;
}

export interface DocumentItem {
  id: string;
  title?: string;
  file: Media;
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
  filename?: string;
}

export interface HeroData {
  id?: string | number;
  isActive: boolean;
  title: string;
  subtitle?: string;
  backgroundType: 'image' | 'color';
  backgroundImage?: Media | number;
  backgroundColor?: 'blue' | 'dark' | 'white';
  ctaText: string;
  ctaLink: string;
  showSecondaryLink: boolean;
  secondaryLinkText?: string;
  secondaryLinkHref?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface FormSubmission {
  name: string;
  phone: string;
  message?: string;
  service?: string;
  equipmentType?: string;
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  console.log(`[API] Fetching: ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      cache: options?.cache ?? 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
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

export async function getServices(category?: string): Promise<{ docs: Service[] }> {
  const params = new URLSearchParams();
  params.append('limit', '100');
  params.append('depth', '1'); // Загружаем связанные медиа
  if (category) params.append('where[category][equals]', category);

  return fetchAPI<{ docs: Service[] }>(`/services?${params.toString()}`, {
    next: { revalidate: 60 },
  });
}

export async function getServiceBySlug(slug: string): Promise<{ docs: Service[] }> {
  return fetchAPI<{ docs: Service[] }>(`/services?where[slug][equals]=${slug}&depth=1`, {
    next: { revalidate: 60 },
  });
}

export async function getCategories(): Promise<{ docs: Category[] }> {
  return fetchAPI<{ docs: Category[] }>(`/categories?limit=100`, {
    next: { revalidate: 60 },
  });
}

export async function getReviews(): Promise<{ docs: Review[] }> {
  return fetchAPI<{ docs: Review[] }>(`/reviews?limit=20&sort=-createdAt`, {
    next: { revalidate: 60 },
  });
}

export async function getHero(): Promise<HeroData | null> {
  const endpoint = '/globals/hero?depth=1';
  console.log(`[API] getHero() called - fetching from ${API_URL}${endpoint}`);

  try {
    const data = await fetchAPI<HeroData>(endpoint, {
      cache: 'no-store',
    });

    console.log('[API] getHero() response:', JSON.stringify(data, null, 2));

    if (!data || !data.id) {
      console.warn('[API] getHero() - no hero data in response');
      return null;
    }

    console.log('[API] getHero() - hero loaded successfully:', {
      title: data.title,
      isActive: data.isActive,
      hasImage: !!data.backgroundImage,
    });

    return data;
  } catch (error) {
    console.error('[API] getHero() failed:', error);
    return null;
  }
}

export async function submitForm(data: FormSubmission): Promise<unknown> {
  return fetchAPI('/form-submissions', {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
}

export function getMediaUrl(media: Media | string | number | undefined): string | null {
  if (!media) return null;
  
  if (typeof media === 'string') return media;
  
  if (typeof media === 'object' && 'url' in media) {
    const baseUrl = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000';
    return media.url.startsWith('http') ? media.url : `${baseUrl}${media.url}`;
  }
  
  console.warn('[API] Media is ID only, fetching full object needed:', media);
  return null;
}

export async function getHeroBackgroundImage(imageId: number | string): Promise<string | null> {
  try {
    const media = await fetchAPI<Media>(`/media/${imageId}`);
    return getMediaUrl(media);
  } catch (error) {
    console.error('[API] Failed to load hero background image:', error);
    return null;
  }
}