-- Ручная миграция для добавления недостающих колонок
-- Запуск: psql $DATABASE_URI -f apps/cms/fix-migration.sql

-- Добавить колонки, если их нет
DO $$
BEGIN
    -- source_page_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'form_submissions' AND column_name = 'source_page_id'
    ) THEN
        ALTER TABLE form_submissions ADD COLUMN source_page_id INTEGER;
        RAISE NOTICE 'Added source_page_id column';
    END IF;

    -- source_block_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'form_submissions' AND column_name = 'source_block_id'
    ) THEN
        ALTER TABLE form_submissions ADD COLUMN source_block_id VARCHAR(255);
        RAISE NOTICE 'Added source_block_id column';
    END IF;

    -- form_data (переименовать data, если существует)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'form_submissions' AND column_name = 'data'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'form_submissions' AND column_name = 'form_data'
    ) THEN
        ALTER TABLE form_submissions RENAME COLUMN data TO form_data;
        RAISE NOTICE 'Renamed data to form_data';
    ELSIF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'form_submissions' AND column_name = 'form_data'
    ) THEN
        ALTER TABLE form_submissions ADD COLUMN form_data JSONB NOT NULL DEFAULT '{}';
        RAISE NOTICE 'Added form_data column';
    END IF;

    -- metadata columns
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'form_submissions' AND column_name = 'metadata_ip_address'
    ) THEN
        ALTER TABLE form_submissions ADD COLUMN metadata_ip_address VARCHAR(255);
        RAISE NOTICE 'Added metadata_ip_address column';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'form_submissions' AND column_name = 'metadata_user_agent'
    ) THEN
        ALTER TABLE form_submissions ADD COLUMN metadata_user_agent TEXT;
        RAISE NOTICE 'Added metadata_user_agent column';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'form_submissions' AND column_name = 'metadata_submitted_at'
    ) THEN
        ALTER TABLE form_submissions ADD COLUMN metadata_submitted_at TIMESTAMP;
        RAISE NOTICE 'Added metadata_submitted_at column';
    END IF;

    -- status
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'form_submissions' AND column_name = 'status'
    ) THEN
        ALTER TABLE form_submissions ADD COLUMN status VARCHAR(50) DEFAULT 'new';
        RAISE NOTICE 'Added status column';
    END IF;

    -- notes
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'form_submissions' AND column_name = 'notes'
    ) THEN
        ALTER TABLE form_submissions ADD COLUMN notes TEXT;
        RAISE NOTICE 'Added notes column';
    END IF;
END $$;

-- Создать индексы для производительности
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_source_page ON form_submissions(source_page_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at);

-- Проверить результат
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'form_submissions'
ORDER BY ordinal_position;
