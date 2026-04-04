#!/usr/bin/env node
/**
 * Verify Select Options in ContactForm
 */

const CMS_URL = process.env.CMS_URL || 'http://localhost:3001';

async function checkSelectOptions() {
  console.log('🔍 Checking select options in ContactForm...\n');
  
  try {
    const res = await fetch(`${CMS_URL}/api/globals/contactForm?depth=2`);
    const data = await res.json();
    
    if (!data.fields) {
      console.log('❌ No fields found in ContactForm');
      return;
    }
    
    // Find select fields
    const selectFields = data.fields.filter(f => f.fieldType === 'select');
    
    console.log(`Found ${selectFields.length} select field(s):\n`);
    
    selectFields.forEach(field => {
      console.log(`Field: ${field.name}`);
      console.log(`Label: ${field.label}`);
      console.log(`Options count: ${field.options?.length || 0}`);
      
      if (field.options && field.options.length > 0) {
        console.log('Options:');
        field.options.forEach((opt, i) => {
          console.log(`  ${i + 1}. ${opt.label} (${opt.value})`);
        });
      } else {
        console.log('⚠️  No options found!');
        console.log('   Run: psql service_center -f migrate-select-options.sql');
      }
      console.log('');
    });
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.log('Make sure CMS is running: pnpm dev:cms');
  }
}

checkSelectOptions();
