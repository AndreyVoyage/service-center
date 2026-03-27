// apps/web/src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001/api';

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
}

export interface HeroData {
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

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  console.log(`[API] Fetching: ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      // По умолчанию отключаем кэширование для dev-режима
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
  if (category) params.append('where[category][equals]', category);

  return fetchAPI<{ docs: Service[] }>(`/services?${params.toString()}`, {
    next: { revalidate: 60 },
  });
}

export async function getServiceBySlug(slug: string): Promise<{ docs: Service[] }> {
  return fetchAPI<{ docs: Service[] }>(`/services?where[slug][equals]=${slug}`, {
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
  const endpoint = '/globals/hero';
  console.log(`[API] getHero() called - fetching from ${API_URL}${endpoint}`);

  try {
    const response = await fetchAPI<{ hero?: HeroData }>(endpoint, {
      cache: 'no-store', // Важно: отключаем кэширование для Hero
    });

    console.log('[API] getHero() response:', JSON.stringify(response, null, 2));

    if (!response.hero) {
      console.warn('[API] getHero() - no hero data in response');
      return null;
    }

    console.log('[API] getHero() - hero loaded successfully:', {
      title: response.hero.title,
      isActive: response.hero.isActive,
    });

    return response.hero;
  } catch (error) {
    console.error('[API] getHero() failed:', error);
    return null;
  }
}

export async function submitForm(data: FormSubmission): Promise<any> {
  return fetchAPI('/form-submissions', {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
}
