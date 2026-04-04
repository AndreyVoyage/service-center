-- =====================================================
-- Миграция: Создание таблицы для опций select полей
-- =====================================================

-- Создать таблицу для опций полей формы
CREATE TABLE IF NOT EXISTS contact_form_fields_options (
    id SERIAL PRIMARY KEY,
    _order INTEGER NOT NULL DEFAULT 0,
    _parent_id INTEGER NOT NULL REFERENCES contact_form_fields(id) ON DELETE CASCADE,
    value VARCHAR(255) NOT NULL,
    label VARCHAR(255) NOT NULL
);

-- Создать индексы
CREATE INDEX IF NOT EXISTS idx_form_fields_options_parent 
    ON contact_form_fields_options(_parent_id);

CREATE INDEX IF NOT EXISTS idx_form_fields_options_order 
    ON contact_form_fields_options(_order);

-- Добавить комментарий
COMMENT ON TABLE contact_form_fields_options IS 'Опции для выпадающих списков (select) в форме контактов';

-- Проверить что таблица создана
SELECT 'Table contact_form_fields_options created successfully' as status;

-- Показать все таблицы contact_form
SELECT tablename FROM pg_tables 
WHERE tablename LIKE 'contact_form%' 
ORDER BY tablename;
