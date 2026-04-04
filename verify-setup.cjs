#!/usr/bin/env node
/**
 * Verify Database Setup
 */

const http = require('http');

async function checkHealth() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3001/api/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch {
          resolve({ status: res.statusCode, data: null });
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(5000, () => reject(new Error('Timeout')));
  });
}

async function main() {
  console.log('🔍 Checking database setup...\n');
  
  try {
    const result = await checkHealth();
    
    if (result.status === 200 && result.data?.status === 'ok') {
      console.log('✅ CMS is running');
      console.log('✅ Health check passed');
      console.log('\nGlobals loaded:');
      Object.entries(result.data.data || {}).forEach(([key, value]) => {
        console.log(`  ${value ? '✓' : '✗'} ${key}`);
      });
      console.log('\n🎉 Database setup is complete!');
    } else {
      console.log('⚠️  Health check returned:', result.status);
      console.log('Response:', result.data);
    }
  } catch (err) {
    console.log('❌ CMS is not responding');
    console.log('Error:', err.message);
    console.log('\n💡 Make sure CMS is running: pnpm dev:cms');
  }
}

main();
