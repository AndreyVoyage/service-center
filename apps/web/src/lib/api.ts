// apps/web/src/lib/api.ts
const API_URL = 'http://localhost:3001/api';

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

export interface FormSubmission {
  name: string;
  phone: string;
  message?: string;
  service?: string;
  equipmentType?: string;
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
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

export async function submitForm(data: FormSubmission): Promise<any> {
  return fetchAPI('/form-submissions', {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
}