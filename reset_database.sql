-- Complete database reset script
-- This will drop all tables and recreate them with the correct schema

-- Drop all tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS boards CASCADE;

-- Drop any existing functions
DROP FUNCTION IF EXISTS upvote_note(UUID, TEXT);
DROP FUNCTION IF EXISTS generate_board_code();

-- Recreate boards table
CREATE TABLE boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    locked BOOLEAN DEFAULT FALSE
);

-- Recreate notes table with correct English types
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    text TEXT NOT NULL CHECK (LENGTH(text) <= 240),
    type TEXT NOT NULL CHECK (type IN ('Question', 'Idea')),
    author TEXT,
    votes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recreate votes table
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(note_id, device_id)
);

-- Create indexes for performance
CREATE INDEX idx_boards_code ON boards(code);
CREATE INDEX idx_notes_board_votes_created ON notes(board_id, votes DESC, created_at DESC);
CREATE INDEX idx_votes_note_device ON votes(note_id, device_id);

-- Enable Row Level Security
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for boards
CREATE POLICY "Allow anonymous read access to boards" ON boards
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert for boards" ON boards
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update for boards" ON boards
    FOR UPDATE USING (true);

-- RLS Policies for notes
CREATE POLICY "Allow anonymous read access to notes" ON notes
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert for notes" ON notes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update for notes" ON notes
    FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous delete for notes" ON notes
    FOR DELETE USING (true);

-- RLS Policies for votes
CREATE POLICY "Allow anonymous read access to votes" ON votes
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert for votes" ON votes
    FOR INSERT WITH CHECK (true);

-- Recreate stored procedure for upvoting notes
CREATE OR REPLACE FUNCTION upvote_note(note_id_param UUID, device_id_param TEXT)
RETURNS INTEGER AS $$
DECLARE
    vote_count INTEGER;
BEGIN
    -- Try to insert the vote (will fail if already exists due to unique constraint)
    INSERT INTO votes (note_id, device_id) 
    VALUES (note_id_param, device_id_param)
    ON CONFLICT (note_id, device_id) DO NOTHING;
    
    -- Update the vote count atomically
    UPDATE notes 
    SET votes = votes + 1 
    WHERE id = note_id_param 
    AND EXISTS (
        SELECT 1 FROM votes 
        WHERE votes.note_id = note_id_param 
        AND votes.device_id = device_id_param
    );
    
    -- Return the current vote count
    SELECT votes INTO vote_count FROM notes WHERE id = note_id_param;
    RETURN COALESCE(vote_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate function to generate random board code
CREATE OR REPLACE FUNCTION generate_board_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
    END LOOP;
    
    -- Check if code already exists, regenerate if it does
    WHILE EXISTS (SELECT 1 FROM boards WHERE code = result) LOOP
        result := '';
        FOR i IN 1..6 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
        END LOOP;
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Enable realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE boards;
ALTER PUBLICATION supabase_realtime ADD TABLE notes;
ALTER PUBLICATION supabase_realtime ADD TABLE votes;
