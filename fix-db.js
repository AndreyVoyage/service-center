#!/usr/bin/env node
/**
 * Database Fix Script
 * Fixes hanging Drizzle migration by creating missing columns
 */

const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'service_center',
  user: 'postgres',
  password: '', // добавьте пароль если есть
});

async function fix() {
  try {
    await client.connect();
    console.log('✓ Connected to database');

    // Check if column exists
    const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'form_submissions' 
      AND column_name = 'source_page_id'
    `);

    if (checkResult.rows.length > 0) {
      console.log('✓ Column source_page_id already exists');
    } else {
      // Create column
      await client.query(`
        ALTER TABLE form_submissions 
        ADD COLUMN source_page_id VARCHAR(255)
      `);
      console.log('✓ Created column source_page_id');
    }

    // Also check for left_block_features table
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE tablename = 'contact_form_left_block_features'
      )
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('⚠ Table contact_form_left_block_features does not exist');
      console.log('Creating...');
      
      await client.query(`
        CREATE TABLE contact_form_left_block_features (
          id SERIAL PRIMARY KEY,
          _order INTEGER NOT NULL DEFAULT 0,
          _parent_id INTEGER NOT NULL REFERENCES contact_form(id) ON DELETE CASCADE,
          icon VARCHAR(50) DEFAULT 'check',
          text VARCHAR(500) NOT NULL
        )
      `);
      
      await client.query(`
        CREATE INDEX idx_left_block_features_parent 
        ON contact_form_left_block_features(_parent_id)
      `);
      
      await client.query(`
        CREATE INDEX idx_left_block_features_order 
        ON contact_form_left_block_features(_order)
      `);
      
      console.log('✓ Created table contact_form_left_block_features');
    } else {
      console.log('✓ Table contact_form_left_block_features already exists');
    }

    console.log('\n✅ All fixes applied!');
    console.log('Now restart: pnpm dev');

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fix();
