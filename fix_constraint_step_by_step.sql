-- Step-by-step database cleanup and constraint fix
-- This will safely clean up the data and fix the constraint

-- Step 1: Check what types currently exist in the database
SELECT DISTINCT type, COUNT(*) as count FROM notes GROUP BY type;

-- Step 2: Convert all existing data to Dutch types first
UPDATE notes SET type = 'Vraag' WHERE type = 'Question';
UPDATE notes SET type = 'Idee' WHERE type = 'Idea';

-- Step 3: Remove any notes with invalid types (if any exist)
DELETE FROM notes WHERE type NOT IN ('Vraag', 'Idee');

-- Step 4: Drop the current constraint
ALTER TABLE notes DROP CONSTRAINT IF EXISTS notes_type_check;

-- Step 5: Add the constraint back with Dutch types
ALTER TABLE notes ADD CONSTRAINT notes_type_check CHECK (type IN ('Vraag', 'Idee'));

-- Step 6: Verify the constraint is working
SELECT DISTINCT type, COUNT(*) as count FROM notes GROUP BY type;
