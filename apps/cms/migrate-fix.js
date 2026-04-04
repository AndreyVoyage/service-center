// Временный скрипт для применения миграции source_page_id
// Запуск: node apps/cms/migrate-fix.js

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URI || 'postgresql://postgres:postgres@localhost:5432/service_center'
});

async function migrate() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking for source_page_id column...');
    
    // Проверить существование колонки
    const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'form_submissions' 
      AND column_name = 'source_page_id'
    `);
    
    if (checkResult.rows.length > 0) {
      console.log('✅ Column source_page_id already exists');
      return;
    }
    
    console.log('➕ Adding source_page_id column...');
    
    // Добавить колонку
    await client.query(`
      ALTER TABLE form_submissions 
      ADD COLUMN source_page_id INTEGER,
      ADD COLUMN source_block_id VARCHAR(255),
      ADD COLUMN form_data JSONB,
      ADD COLUMN metadata_ip_address VARCHAR(255),
      ADD COLUMN metadata_user_agent TEXT,
      ADD COLUMN metadata_submitted_at TIMESTAMP,
      ADD COLUMN status VARCHAR(50) DEFAULT 'new',
      ADD COLUMN notes TEXT
    `);
    
    // Скопировать данные из data в form_data если нужно
    await client.query(`
      UPDATE form_submissions 
      SET form_data = data::jsonb 
      WHERE form_data IS NULL AND data IS NOT NULL
    `);
    
    console.log('✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
