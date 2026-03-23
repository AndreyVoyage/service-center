// apps/web/src/lib/check-hero.ts
// Скрипт для проверки подключения к Hero API

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

export interface HeroCheckResult {
  success: boolean;
  status: number;
  statusText: string;
  data?: any;
  error?: string;
  responseTime: number;
}

/**
 * Проверяет доступность Hero API
 * @returns Результат проверки с данными или ошибкой
 */
export async function checkHeroAPI(): Promise<HeroCheckResult> {
  const url = `${CMS_URL}/api/globals/hero`;
  const startTime = Date.now();

  console.log('\n========== HERO API CHECK ==========');
  console.log(`[CheckHero] Testing connection to: ${url}`);
  console.log(`[CheckHero] Timestamp: ${new Date().toISOString()}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseTime = Date.now() - startTime;

    console.log(`[CheckHero] Response status: ${response.status} ${response.statusText}`);
    console.log(`[CheckHero] Response time: ${responseTime}ms`);

    if (!response.ok) {
      const errorResult: HeroCheckResult = {
        success: false,
        status: response.status,
        statusText: response.statusText,
        error: `HTTP Error: ${response.status} ${response.statusText}`,
        responseTime,
      };
      console.log('[CheckHero] ❌ FAILED - HTTP Error');
      console.log('====================================\n');
      return errorResult;
    }

    const data = await response.json();

    console.log('[CheckHero] ✅ SUCCESS - Data received:');
    console.log(JSON.stringify(data, null, 2));

    // Проверяем структуру ответа
    if (!data.hero) {
      console.warn('[CheckHero] ⚠️ Warning: Response does not contain "hero" field');
    } else {
      const hero = data.hero;
      console.log('\n[CheckHero] Hero details:');
      console.log(`  - Title: ${hero.title || 'NOT SET'}`);
      console.log(`  - isActive: ${hero.isActive}`);
      console.log(`  - Background Type: ${hero.backgroundType}`);
      console.log(`  - Background Color: ${hero.backgroundColor || 'N/A'}`);
      console.log(`  - CTA Text: ${hero.ctaText || 'NOT SET'}`);
      console.log(`  - CTA Link: ${hero.ctaLink || 'NOT SET'}`);
    }

    console.log('====================================\n');

    return {
      success: true,
      status: response.status,
      statusText: response.statusText,
      data,
      responseTime,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    console.error('[CheckHero] ❌ FAILED - Exception:', errorMessage);
    console.log('====================================\n');

    return {
      success: false,
      status: 0,
      statusText: 'Network Error',
      error: errorMessage,
      responseTime,
    };
  }
}

/**
 * Быстрая проверка Hero API (для использования в компонентах)
 */
export async function quickHeroCheck(): Promise<boolean> {
  const result = await checkHeroAPI();
  return result.success;
}

// Если скрипт запущен напрямую (Node.js)
if (typeof window === 'undefined' && require.main === module) {
  checkHeroAPI().then((result) => {
    process.exit(result.success ? 0 : 1);
  });
}
