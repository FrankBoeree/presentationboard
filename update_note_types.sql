-- Update note types from Dutch to English
-- This script updates the database constraint and existing data

-- First, update the constraint
ALTER TABLE notes DROP CONSTRAINT IF EXISTS notes_type_check;
ALTER TABLE notes ADD CONSTRAINT notes_type_check CHECK (type IN ('Question', 'Idea', 'Remark'));

-- Update existing data (if any)
UPDATE notes SET type = 'Question' WHERE type = 'Vraag';
UPDATE notes SET type = 'Idea' WHERE type = 'Idee';
UPDATE notes SET type = 'Remark' WHERE type = 'Actie' OR type = 'Opmerking';
