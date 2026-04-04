-- ============================================
-- MANUAL DATABASE FIX
-- Run this in pgAdmin, DBeaver or any PostgreSQL client
-- ============================================

-- Fix 1: Add source_page_id column to form_submissions
ALTER TABLE form_submissions 
ADD COLUMN IF NOT EXISTS source_page_id VARCHAR(255);

-- Verify
SELECT 'source_page_id column' as check_item, 
       CASE WHEN EXISTS (
         SELECT 1 FROM information_schema.columns 
         WHERE table_name = 'form_submissions' AND column_name = 'source_page_id'
       ) THEN 'EXISTS ✓' ELSE 'MISSING ✗' END as status;

-- Fix 2: Create contact_form_left_block_features table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'contact_form_left_block_features') THEN
        CREATE TABLE contact_form_left_block_features (
            id SERIAL PRIMARY KEY,
            _order INTEGER NOT NULL DEFAULT 0,
            _parent_id INTEGER NOT NULL REFERENCES contact_form(id) ON DELETE CASCADE,
            icon VARCHAR(50) DEFAULT 'check',
            text VARCHAR(500) NOT NULL
        );
        
        CREATE INDEX idx_left_block_features_parent ON contact_form_left_block_features(_parent_id);
        CREATE INDEX idx_left_block_features_order ON contact_form_left_block_features(_order);
        
        RAISE NOTICE 'Created table contact_form_left_block_features';
    ELSE
        RAISE NOTICE 'Table contact_form_left_block_features already exists';
    END IF;
END $$;

-- Verify
SELECT 'left_block_features table' as check_item,
       CASE WHEN EXISTS (
         SELECT 1 FROM pg_tables WHERE tablename = 'contact_form_left_block_features'
       ) THEN 'EXISTS ✓' ELSE 'MISSING ✗' END as status;

-- List all contact_form tables
SELECT tablename 
FROM pg_tables 
WHERE tablename LIKE 'contact_form%' 
ORDER BY tablename;
