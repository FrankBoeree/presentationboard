-- Revert database constraint back to Dutch types to match the code
-- This will allow the application to work while we figure out the type conversion

-- Drop the current constraint
ALTER TABLE notes DROP CONSTRAINT IF EXISTS notes_type_check;

-- Add back the original constraint with Dutch types
ALTER TABLE notes ADD CONSTRAINT notes_type_check CHECK (type IN ('Vraag', 'Idee'));

-- Convert any English types back to Dutch
UPDATE notes SET type = 'Vraag' WHERE type = 'Question';
UPDATE notes SET type = 'Idee' WHERE type = 'Idea';
