-- ============================================
-- CRITICAL FIX: Add contact_form_left_block_features table
-- Run this SQL in your PostgreSQL database
-- ============================================

-- Check if table already exists (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'contact_form_left_block_features') THEN
        
        -- Create the features table for leftBlock
        CREATE TABLE contact_form_left_block_features (
            id SERIAL PRIMARY KEY,
            _order INTEGER NOT NULL,
            _parent_id INTEGER NOT NULL REFERENCES contact_form(id) ON DELETE CASCADE ON UPDATE NO ACTION,
            icon VARCHAR(50) DEFAULT 'check' NOT NULL,
            text VARCHAR(255) NOT NULL
        );

        -- Create indexes
        CREATE INDEX idx_contact_form_left_block_features_parent 
            ON contact_form_left_block_features(_parent_id);

        CREATE INDEX idx_contact_form_left_block_features_order 
            ON contact_form_left_block_features(_order);

        -- Add comments
        COMMENT ON TABLE contact_form_left_block_features IS 'Features array for ContactForm leftBlock';
        COMMENT ON COLUMN contact_form_left_block_features.icon IS 'Icon type: check, star, shield, clock, phone, tool';
        COMMENT ON COLUMN contact_form_left_block_features.text IS 'Feature text displayed in UI';
        
        RAISE NOTICE 'Table contact_form_left_block_features created successfully';
    ELSE
        RAISE NOTICE 'Table contact_form_left_block_features already exists';
    END IF;
END $$;
