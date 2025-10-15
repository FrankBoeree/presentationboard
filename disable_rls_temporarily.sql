-- Temporarily disable RLS to fix notes disappearing issue
-- This is a quick fix to get the app working

-- Disable RLS on notes table
ALTER TABLE notes DISABLE ROW LEVEL SECURITY;

-- Disable RLS on boards table  
ALTER TABLE boards DISABLE ROW LEVEL SECURITY;

-- Disable RLS on votes table
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('notes', 'boards', 'votes');

-- Test that we can now access all notes
SELECT COUNT(*) as total_notes FROM notes;
SELECT COUNT(*) as total_boards FROM boards;
