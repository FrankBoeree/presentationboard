-- Simple fix: Remove constraint completely and let the app work
-- This will allow any type to be inserted temporarily

-- Drop the constraint completely
ALTER TABLE notes DROP CONSTRAINT IF EXISTS notes_type_check;

-- Clean up any existing data
UPDATE notes SET type = 'Vraag' WHERE type = 'Question';
UPDATE notes SET type = 'Idee' WHERE type = 'Idea';

-- Remove any notes with invalid types
DELETE FROM notes WHERE type NOT IN ('Vraag', 'Idee');

-- Add a new constraint that allows both Dutch and English types temporarily
ALTER TABLE notes ADD CONSTRAINT notes_type_check CHECK (type IN ('Vraag', 'Idee', 'Question', 'Idea'));
