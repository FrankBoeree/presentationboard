-- Update database schema to use English types only
-- This script updates the database constraint and existing data

-- First, update the constraint to only allow Question and Idea
ALTER TABLE notes DROP CONSTRAINT IF EXISTS notes_type_check;
ALTER TABLE notes ADD CONSTRAINT notes_type_check CHECK (type IN ('Question', 'Idea'));

-- Update existing data (if any) from Dutch to English
UPDATE notes SET type = 'Question' WHERE type = 'Vraag';
UPDATE notes SET type = 'Idea' WHERE type = 'Idee';

-- Remove any notes with old types that don't map to Question/Idea
-- (This will remove 'Actie' and 'Opmerking' if they exist)
DELETE FROM notes WHERE type NOT IN ('Question', 'Idea');
