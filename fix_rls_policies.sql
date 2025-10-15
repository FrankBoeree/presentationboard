-- Fix RLS policies for notes table
-- This script will ensure that notes are visible to all users

-- First, let's check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'notes';

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Allow anonymous read access to notes" ON notes;
DROP POLICY IF EXISTS "Allow anonymous insert for notes" ON notes;
DROP POLICY IF EXISTS "Allow anonymous update for notes" ON notes;
DROP POLICY IF EXISTS "Allow anonymous delete for notes" ON notes;

-- Create new, more permissive policies
CREATE POLICY "Allow all read access to notes" ON notes
    FOR SELECT USING (true);

CREATE POLICY "Allow all insert for notes" ON notes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update for notes" ON notes
    FOR UPDATE USING (true);

CREATE POLICY "Allow all delete for notes" ON notes
    FOR DELETE USING (true);

-- Also ensure boards table has proper policies
DROP POLICY IF EXISTS "Allow anonymous read access to boards" ON boards;
DROP POLICY IF EXISTS "Allow anonymous insert for boards" ON boards;
DROP POLICY IF EXISTS "Allow anonymous update for boards" ON boards;

CREATE POLICY "Allow all read access to boards" ON boards
    FOR SELECT USING (true);

CREATE POLICY "Allow all insert for boards" ON boards
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update for boards" ON boards
    FOR UPDATE USING (true);

-- Test query to verify policies work
SELECT 'Testing notes access...' as test;
SELECT COUNT(*) as notes_count FROM notes;
SELECT 'Testing boards access...' as test;
SELECT COUNT(*) as boards_count FROM boards;
