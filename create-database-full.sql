-- =====================================================
-- ColdService Database Schema
-- Создание полной схемы БД для Payload CMS
-- Выполнить в pgAdmin Query Tool для БД service_center
-- =====================================================

-- =====================================================
-- 1. Таблица Users (для авторизации в админке)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'editor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. Таблица Media (для загрузки файлов)
-- =====================================================
CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100),
    filesize INTEGER,
    width INTEGER,
    height INTEGER,
    alt VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. Таблица Categories (для услуг)
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. Таблица Services (услуги)
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    category_id INTEGER REFERENCES categories(id),
    image_id INTEGER REFERENCES media(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);

-- =====================================================
-- 5. Таблица Reviews (отзывы)
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    photo_id INTEGER REFERENCES media(id),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_published ON reviews(is_published);

-- =====================================================
-- 6. Таблица Form Submissions (заявки)
-- =====================================================
CREATE TABLE IF NOT EXISTS form_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    message TEXT,
    source_page_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_form_submissions_source ON form_submissions(source_page_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);

-- =====================================================
-- 7. Global: Contact Form
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_form (
    id SERIAL PRIMARY KEY,
    is_active BOOLEAN DEFAULT true,
    left_block_title VARCHAR(255) DEFAULT 'Оставить заявку',
    left_block_description TEXT DEFAULT 'Заполните форму, и мы перезвоним вам в течение 15 минут',
    title VARCHAR(255) DEFAULT 'Оставить заявку',
    subtitle TEXT DEFAULT 'Мы свяжемся с вами в ближайшее время',
    submit_button_text VARCHAR(255) DEFAULT 'Вызвать мастера',
    success_message TEXT DEFAULT 'Спасибо! Мы перезвоним вам.',
    notifications_email VARCHAR(255),
    notifications_telegram_chat_id VARCHAR(255),
    notifications_send_telegram BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO contact_form (id, is_active) VALUES (1, true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 8. Таблица для leftBlock.features
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_form_left_block_features (
    id SERIAL PRIMARY KEY,
    _order INTEGER NOT NULL DEFAULT 0,
    _parent_id INTEGER NOT NULL REFERENCES contact_form(id) ON DELETE CASCADE,
    icon VARCHAR(50) DEFAULT 'check',
    text VARCHAR(500) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_left_block_features_parent ON contact_form_left_block_features(_parent_id);
CREATE INDEX IF NOT EXISTS idx_left_block_features_order ON contact_form_left_block_features(_order);

INSERT INTO contact_form_left_block_features (_parent_id, _order, icon, text) VALUES
(1, 0, 'check', 'Бесплатная диагностика при ремонте'),
(1, 1, 'check', 'Прозрачное ценообразование'),
(1, 2, 'check', 'Официальный договор')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 9. Таблица для полей формы
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_form_fields (
    id SERIAL PRIMARY KEY,
    _order INTEGER NOT NULL DEFAULT 0,
    _parent_id INTEGER NOT NULL REFERENCES contact_form(id) ON DELETE CASCADE,
    field_type VARCHAR(50) NOT NULL,
    name VARCHAR(255),
    label VARCHAR(255),
    placeholder VARCHAR(255),
    required BOOLEAN DEFAULT false,
    "order" INTEGER
);

CREATE INDEX IF NOT EXISTS idx_contact_form_fields_parent ON contact_form_fields(_parent_id);

-- =====================================================
-- 10. Таблица для опций полей
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_form_fields_options (
    id SERIAL PRIMARY KEY,
    _order INTEGER NOT NULL DEFAULT 0,
    _parent_id INTEGER NOT NULL REFERENCES contact_form_fields(id) ON DELETE CASCADE,
    value VARCHAR(255),
    label VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_fields_options_parent ON contact_form_fields_options(_parent_id);

-- =====================================================
-- 11. Global: Footer
-- =====================================================
CREATE TABLE IF NOT EXISTS footer (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) DEFAULT 'ColdService',
    description TEXT,
    copyright VARCHAR(255) DEFAULT '2024 ColdService. Все права защищены.',
    show_legal_links BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 12. Global: Hero
-- =====================================================
CREATE TABLE IF NOT EXISTS hero (
    id SERIAL PRIMARY KEY,
    is_active BOOLEAN DEFAULT true,
    title VARCHAR(255) DEFAULT 'Ремонт промышленных холодильников 24/7',
    subtitle TEXT,
    background_type VARCHAR(50) DEFAULT 'color',
    background_color VARCHAR(50) DEFAULT '#2563EB',
    background_image_id INTEGER REFERENCES media(id),
    button_text VARCHAR(255) DEFAULT 'Оставить заявку',
    button_link VARCHAR(255) DEFAULT '/#form',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Проверка
-- =====================================================
SELECT 'Tables created successfully' as status;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
