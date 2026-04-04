#!/usr/bin/env node
/**
 * Verify Database and API Connection
 * Node.js ES Module
 */

import fs from 'fs/promises';
import http from 'http';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(status, message) {
  const color = status === 'ok' ? colors.green : status === 'warn' ? colors.yellow : colors.red;
  const symbol = status === 'ok' ? '✓' : status === 'warn' ? '!' : '✗';
  console.log(`${color}[${symbol}]${colors.reset} ${message}`);
}

function section(title) {
  console.log(`\n${colors.cyan}=== ${title} ===${colors.reset}\n`);
}

async function checkEnv() {
  section('Проверка .env файлов');
  
  // Check CMS .env
  try {
    const cmsEnv = await fs.readFile('apps/cms/.env.local', 'utf8');
    const dbMatch = cmsEnv.match(/DATABASE_URI=(.+)/);
    if (dbMatch) {
      const uri = dbMatch[1];
      if (uri.includes('service_center')) {
        log('ok', `CMS: DATABASE_URI → service_center`);
      } else if (uri.includes('payload')) {
        log('error', `CMS: DATABASE_URI → payload (НУЖНО ИСПРАВИТЬ!)`);
        console.log(`   ${colors.yellow}Исправьте: ${uri}${colors.reset}`);
      } else {
        log('warn', `CMS: DATABASE_URI → ${uri}`);
      }
    } else {
      log('error', 'CMS: DATABASE_URI не найден в .env.local');
    }
  } catch {
    log('error', 'CMS: .env.local не найден');
  }

  // Check Web .env
  try {
    const webEnv = await fs.readFile('apps/web/.env.local', 'utf8');
    const cmsUrlMatch = webEnv.match(/NEXT_PUBLIC_CMS_URL=(.+)/);
    if (cmsUrlMatch) {
      const url = cmsUrlMatch[1];
      if (url.includes('localhost:3001')) {
        log('ok', `Web: NEXT_PUBLIC_CMS_URL → localhost:3001`);
      } else {
        log('warn', `Web: NEXT_PUBLIC_CMS_URL → ${url}`);
      }
    } else {
      log('error', 'Web: NEXT_PUBLIC_CMS_URL не найден');
    }
  } catch {
    log('error', 'Web: .env.local не найден');
  }
}

async function checkAPI(url, name) {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          log('ok', `${name}: HTTP 200`);
          try {
            const json = JSON.parse(data);
            resolve({ ok: true, data: json });
          } catch {
            resolve({ ok: true, data: null });
          }
        } else {
          log('warn', `${name}: HTTP ${res.statusCode}`);
          resolve({ ok: false, status: res.statusCode });
        }
      });
    });
    
    req.on('error', (err) => {
      log('error', `${name}: ${err.message}`);
      resolve({ ok: false, error: err.message });
    });
    
    req.on('timeout', () => {
      req.destroy();
      log('error', `${name}: Timeout`);
      resolve({ ok: false, error: 'timeout' });
    });
  });
}

async function main() {
  console.log(`${colors.cyan}`);
  console.log('╔══════════════════════════════════════╗');
  console.log('║   ColdService Connection Verifier    ║');
  console.log('╚══════════════════════════════════════╝');
  console.log(`${colors.reset}`);

  await checkEnv();
  
  section('Проверка API');
  
  const cmsResult = await checkAPI('http://localhost:3001/api/health', 'CMS API');
  if (cmsResult.ok && cmsResult.data) {
    console.log(`   ${colors.cyan}Status:${colors.reset} ${cmsResult.data.status}`);
    if (cmsResult.data.data) {
      console.log(`   ${colors.cyan}Globals:${colors.reset}`);
      Object.entries(cmsResult.data.data).forEach(([key, value]) => {
        const symbol = value ? colors.green + '✓' : colors.red + '✗';
        console.log(`     ${symbol} ${key}${colors.reset}`);
      });
    }
  }
  
  await checkAPI('http://localhost:3002', 'Web');
  
  section('Результат');
  console.log('Если есть ошибки ✗:')
  console.log('  1. Убедитесь что pnpm dev запущен');
  console.log('  2. Проверьте .env.local файлы');
  console.log('  3. Проверьте что БД service_center существует');
  console.log('');
}

main().catch(console.error);
