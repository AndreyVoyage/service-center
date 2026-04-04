// apps/web/src/lib/api.ts

const rawUrl = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';
const API_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

console.log('[API] CMS URL configured:', API_URL);

// Флаг готовности CMS
let cmsReady = false;

// Ожидание готовности CMS (важно при первом запуске)
export const waitForCMS = async (maxWait = 60000): Promise<boolean> => {
  if (cmsReady) return true;
  
  console.log('[API] Waiting for CMS to be ready...');
  const start = Date.now();
  
  while (Date.now() - start < maxWait) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const res = await fetch(`${rawUrl}/api/health`, { 
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      
      if (res.ok) {
        cmsReady = true;
        console.log(`[API] CMS ready after ${Date.now() - start}ms`);
        return true;
      }
    } catch {
      // Продолжаем ожидание
    }
    
    // Ждём 1 секунду перед следующей попыткой
    await new Promise(r => setTimeout(r, 1000));
    
    // Показываем прогресс каждые 5 секунд
    const elapsed = Date.now() - start;
    if (elapsed % 5000 < 1000) {
      console.log(`[API] Still waiting for CMS... (${Math.round(elapsed / 1000)}s)`);
    }
  }
  
  console.warn(`[API] CMS not ready after ${maxWait}ms, proceeding anyway`);
  return false;
};

// In-memory кэш для SSR (не сохраняется между запросами, но помогает при ретраях)
const ssrCache = new Map<string, { data: any; timestamp: number }>();
const SSR_CACHE_TTL = 30000; // 30 секунд

// Утилита для кэширования SSR
async function getCachedOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = ssrCache.get(key);
  if (cached && Date.now() - cached.timestamp < SSR_CACHE_TTL) {
    console.log(`[API] SSR cache hit for ${key}`);
    return cached.data as T;
  }
  
  const data = await fetcher();
  ssrCache.set(key, { data, timestamp: Date.now() });
  return data;
}

// Исправленный интерфейс GalleryItem
export interface GalleryItem {
  id?: string;
  image: Media;
  alt?: string;
}

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
  gallery?: GalleryItem[];  // ← массив объектов с полем image
  customData?: Record<string, unknown>; // Динамические поля из Field Definitions
}

// Определение динамического поля услуги
export interface ServiceFieldDefinition {
  id: string;
  fieldName: string;
  fieldType: 'text' | 'number' | 'select' | 'checkbox';
  label: string;
  options?: Array<{
    value: string;
    label: string;
  }>;
}

export interface Category {
  id: string;
  title: string;
  slug: string;
}

// Получить все определения полей
export async function getServiceFieldDefinitions(): Promise<ServiceFieldDefinition[]> {
  const res = await fetch(`${API_URL}/service-field-definitions?limit=100`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch field definitions');
  const data = await res.json();
  return data.docs || [];
}

export interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  photo?: Media | number; // Media с depth: 1, иначе number (ID)
  isPublished?: boolean;
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

export interface FooterContact {
  email?: string;
  phone?: string;
  address?: string;
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'telegram' | 'whatsapp' | 'vk' | 'youtube';
  url: string;
  isActive?: boolean;
}

export interface FooterNavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface FooterNavColumn {
  title?: string;
  links?: FooterNavLink[];
}

export interface FooterLegalLink {
  label: string;
  href: string;
}

export interface FooterData {
  id?: string | number;
  logo?: Media;
  companyName?: string;
  description?: string;
  contacts?: FooterContact;
  socialLinks?: SocialLink[];
  navigationColumns?: FooterNavColumn[];
  copyright?: string;
  showLegalLinks?: boolean;
  legalLinks?: FooterLegalLink[];
}

export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormField {
  fieldType: 'name' | 'phone' | 'email' | 'message' | 'select' | 'checkbox';
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: FormFieldOption[];
  order?: number;
}

export interface ContactFormNotifications {
  email?: string;
  telegramChatId?: string;
  sendTelegram?: boolean;
}

export interface ContactFormFeature {
  icon: 'check' | 'star' | 'shield' | 'clock' | 'phone' | 'tool';
  text: string;
}

export interface ContactFormLeftBlock {
  title?: string;
  description?: string;
  features?: ContactFormFeature[];
}

export interface ContactFormData {
  id?: string | number;
  isActive?: boolean;
  leftBlock?: ContactFormLeftBlock;
  title?: string;
  subtitle?: string;
  fields?: FormField[];
  submitButtonText?: string;
  successMessage?: string;
  notifications?: ContactFormNotifications;
}

export interface FormSubmission {
  name: string;
  phone: string;
  message?: string;
  service?: string;
  equipmentType?: string;
}

const API_TIMEOUT = 60000; // 60 секунд таймаут (для компиляции CMS)
const API_RETRIES = 2; // 2 ретрая
const RETRY_DELAY = 3000; // 3 секунды между ретраями

// Fetch с таймаутом
async function fetchWithTimeout(
  url: string, 
  options: RequestInit,
  timeout = API_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

// Fetch с ретраями
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit,
  retries = API_RETRIES
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let i = 0; i <= retries; i++) {
    try {
      const startTime = Date.now();
      const response = await fetchWithTimeout(url, options);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`[API] ${url} took ${Date.now() - startTime}ms`);
      return data;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`[API] Attempt ${i + 1}/${retries + 1} failed for ${url}:`, lastError.message);
      
      if (i < retries) {
        // Exponential backoff: 1s, 2s, 3s
        const delay = RETRY_DELAY * (i + 1);
        console.log(`[API] Retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  
  throw lastError || new Error('Request failed after retries');
}

async function fetchAPI<T>(
  endpoint: string, 
  options?: RequestInit & { next?: { revalidate?: number; tags?: string[] } }
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  console.log(`[API] Fetching: ${url}`);

  // Определяем параметры кэширования
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
    delete fetchOptions.cache;
  } else {
    fetchOptions.cache = options?.cache ?? 'no-store';
    delete fetchOptions.next;
  }

  return fetchWithRetry<T>(url, fetchOptions);
}

// Динамическое получение услуг
export async function getServices(category?: string): Promise<{ docs: Service[] }> {
  const params = new URLSearchParams();
  params.append('limit', '100');
  if (category) params.append('where[category][equals]', category);

  try {
    return await fetchAPI<{ docs: Service[] }>(`/services?${params.toString()}`, {
      next: { revalidate: 60 }, // ISR - обновление каждые 60 сек
    });
  } catch (error) {
    console.error('[API] getServices() failed:', error);
    const { fallbackServices } = await import('./fallback-data');
    console.warn('[API] getServices() - using fallback data');
    return { docs: fallbackServices as Service[] };
  }
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
// depth: 1 чтобы получить полные объекты photo (Media), а не только ID
export async function getReviews(
  filter: 'all' | '5' | '4plus' = 'all',
  limit: number = 20
): Promise<{ docs: Review[] }> {
  let query = `/reviews?limit=${limit}&sort=-createdAt&depth=1`;
  
  // Добавляем фильтрацию по рейтингу
  if (filter === '5') {
    query += '&where[rating][equals]=5';
  } else if (filter === '4plus') {
    query += '&where[rating][greater_than_equal]=4';
  }
  
  // Фильтруем только опубликованные
  query += '&where[isPublished][equals]=true';
  
  return fetchAPI<{ docs: Review[] }>(query, {
    next: { revalidate: 60 },
  });
}

// Получение Hero (глобальные настройки)
export async function getHero(): Promise<HeroData | null> {
  return getCachedOrFetch('hero', async () => {
    const endpoint = '/globals/hero';
    
    try {
      const data = await fetchAPI<HeroData>(endpoint, {
        next: { revalidate: 60 },
      });

      if (!data || (!data.id && !data.title)) {
        return null;
      }

      return data;
    } catch (error) {
      console.error('[API] getHero() failed:', error);
      const { fallbackHero } = await import('./fallback-data');
      return fallbackHero as HeroData;
    }
  });
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
  media: Media | string | undefined | null,
  size: 'thumbnail' | 'card' | 'full' = 'full'
): string | null {
  if (!media) return null;
  
  // Если передана строка (уже URL)
  if (typeof media === 'string') {
    return media.startsWith('http') ? media : `${CMS_URL}${media}`;
  }
  
  // Проверяем размеры
  if (size !== 'full' && media.sizes?.[size]?.url) {
    const sizedUrl = media.sizes[size]!.url;
    return sizedUrl.startsWith('http') ? sizedUrl : `${CMS_URL}${sizedUrl}`;
  }
  
  // Оригинал
  if (media.url) {
    return media.url.startsWith('http') ? media.url : `${CMS_URL}${media.url}`;
  }
  
  return null;
}

// Функция для получения URL из gallery item
export function getGalleryImageUrl(
  galleryItem: GalleryItem | undefined,
  size: 'thumbnail' | 'card' | 'full' = 'full'
): string | null {
  if (!galleryItem?.image) return null;
  return getImageUrl(galleryItem.image, size);
}

// === FormBuilder API ===

export interface FormFieldConfig {
  fieldType: 'name' | 'phone' | 'email' | 'message' | 'custom';
  customType?: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'textarea';
  isEnabled: boolean;
  isRequired: boolean;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  width: 'full' | 'half' | 'third';
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    errorMessage?: string;
  };
  options?: Array<{ label: string; value: string }>;
}

export interface FormBuilderBlock {
  id: string;
  blockType: 'formBuilder';
  title?: string;
  subtitle?: string;
  submitButtonText?: string;
  successMessage?: string;
  fields: FormFieldConfig[];
  notifications?: {
    emailRecipients?: Array<{ email: string }>;
    sendToTelegram?: boolean;
    telegramChatId?: string;
    telegramTemplate?: string;
    saveToDatabase?: boolean;
  };
  spamProtection?: {
    honeypot?: string;
    recaptcha?: boolean;
  };
}

// Отправка формы FormBuilder
export async function submitFormBuilder(
  pageSlug: string,
  blockId: string,
  formData: Record<string, string>
): Promise<{ success: boolean; message?: string; errors?: Record<string, string> }> {
  const endpoint = '/my-route'; // Временно используем my-route
  
  try {
    const response = await fetch(`${rawUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageSlug,
        blockId,
        formData,
        metadata: {
          submittedAt: new Date().toISOString(),
        },
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[API] Form submission error:', error);
    return { success: false, message: 'Ошибка отправки формы' };
  }
}

// Получение Footer (глобальные настройки)
export async function getFooter(): Promise<FooterData | null> {
  return getCachedOrFetch('footer', async () => {
    const endpoint = '/globals/footer';
    
    try {
      const response = await fetchAPI<FooterData>(endpoint, {
        next: { revalidate: 300 },
      });

      if (!response) {
        return null;
      }

      return response;
    } catch (error) {
      console.error('[API] getFooter() failed:', error);
      const { fallbackFooter } = await import('./fallback-data');
      return fallbackFooter as FooterData;
    }
  });
}

// Получение Contact Form (глобальные настройки)
export async function getContactForm(): Promise<ContactFormData | null> {
  return getCachedOrFetch('contactForm', async () => {
    const endpoint = '/globals/contactForm';
    
    try {
      const response = await fetchAPI<ContactFormData>(endpoint, {
        next: { revalidate: 300 },
      });

      if (!response) {
        return null;
      }

      return response;
    } catch (error) {
      console.error('[API] getContactForm() failed:', error);
      const { fallbackContactForm } = await import('./fallback-data');
      return fallbackContactForm as ContactFormData;
    }
  });
}