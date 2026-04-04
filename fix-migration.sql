-- ============================================
-- Исправление зависшей миграции source_page_id
-- ============================================

-- Добавить колонку source_page_id если её нет
ALTER TABLE form_submissions 
ADD COLUMN IF NOT EXISTS source_page_id VARCHAR(255);

-- Проверить что колонка создалась
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'form_submissions' 
AND column_name = 'source_page_id';
