#!/usr/bin/env node
/**
 * Debug Services API
 * Run: node debug-services.mjs
 */

const CMS_URL = process.env.CMS_URL || 'http://localhost:3001';

async function testEndpoint(url, name) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${name}`);
  console.log(`URL: ${url}`);
  console.log('-'.repeat(60));
  
  try {
    const res = await fetch(url, { timeout: 5000 });
    const data = await res.json();
    
    console.log('Status:', res.status);
    console.log('Total docs:', data.totalDocs ?? data.docs?.length ?? 'N/A');
    
    if (data.docs?.length > 0) {
      console.log('First item title:', data.docs[0].title);
      console.log('First item slug:', data.docs[0].slug);
      console.log('Has image:', !!data.docs[0].image);
      console.log('Image URL:', data.docs[0].image?.url || 'N/A');
    } else {
      console.log('⚠️  No documents returned');
    }
    
    return { success: true, data };
  } catch (e) {
    console.error('❌ Error:', e.message);
    return { success: false, error: e.message };
  }
}

async function main() {
  console.log('🔍 Services API Debug');
  console.log(`CMS URL: ${CMS_URL}`);
  
  // Test different endpoints
  await testEndpoint(`${CMS_URL}/api/services`, '1. All services (no params)');
  await testEndpoint(`${CMS_URL}/api/services?limit=3`, '2. Limited to 3');
  await testEndpoint(`${CMS_URL}/api/services?limit=6&depth=1`, '3. With depth=1 (images)');
  await testEndpoint(`${CMS_URL}/api/services?where[isActive][equals]=true`, '4. Active only');
  await testEndpoint(`${CMS_URL}/api/services?where[isFeatured][equals]=true`, '5. Featured only');
  
  console.log('\n' + '='.repeat(60));
  console.log('Debug complete!');
  console.log('='.repeat(60));
}

main().catch(console.error);
