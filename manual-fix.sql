-- ============================================
-- Ручное исправление: создание таблицы leftBlock.features
-- Выполнить в pgAdmin, DBeaver или psql
-- ============================================

-- Проверка существования таблицы
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'contact_form_left_block_features') THEN
        RAISE NOTICE 'Table contact_form_left_block_features already exists. Skipping.';
    ELSE
        -- Создание таблицы для features array
        CREATE TABLE contact_form_left_block_features (
            id SERIAL PRIMARY KEY,
            _order INTEGER NOT NULL DEFAULT 0,
            _parent_id INTEGER NOT NULL REFERENCES contact_form(id) ON DELETE CASCADE ON UPDATE NO ACTION,
            icon VARCHAR(50) DEFAULT 'check',
            text VARCHAR(500) NOT NULL
        );

        -- Индексы
        CREATE INDEX idx_left_block_features_parent 
            ON contact_form_left_block_features(_parent_id);
        CREATE INDEX idx_left_block_features_order 
            ON contact_form_left_block_features(_order);

        RAISE NOTICE 'Table contact_form_left_block_features created successfully!';
    END IF;
END $$;

-- Проверка результата
SELECT tablename FROM pg_tables WHERE tablename LIKE 'contact_form%' ORDER BY tablename;
