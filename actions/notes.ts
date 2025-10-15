'use server'

import { supabase } from '@/lib/supabase'

export interface Note {
  id: string
  board_id: string
  text: string
  type: 'Question' | 'Idea'
  author: string | null
  votes: number
  created_at: string
}

export async function createNote(
  boardId: string,
  text: string,
  type: 'Question' | 'Idea',
  author?: string
): Promise<{ success: boolean; note?: Note; error?: string }> {
  try {
    // Validation
    if (!text || text.trim().length === 0) {
      return { success: false, error: 'Text is required' }
    }

    if (text.length > 240) {
      return { success: false, error: 'Text must be maximum 240 characters' }
    }

    if (!['Question', 'Idea'].includes(type)) {
      return { success: false, error: 'Invalid type' }
    }

    // Basic profanity check
    const profanityWords = ['spam', 'test', 'lorem', 'ipsum']
    const lowerText = text.toLowerCase()
    if (profanityWords.some(word => lowerText.includes(word))) {
      return { success: false, error: 'Text contains unwanted words' }
    }

    // Check if board exists and is not locked
    const { data: board, error: boardError } = await supabase
      .from('boards')
      .select('locked')
      .eq('id', boardId)
      .single()

    if (boardError) {
      console.error('Error checking board:', boardError)
      return { success: false, error: 'Board not found' }
    }

    if (board.locked) {
      return { success: false, error: 'Board is locked' }
    }

    console.log('🔍 DEBUG: Creating note with data:', { boardId, text: text.trim(), type, author: author?.trim() || null })

    const { data, error } = await supabase
      .from('notes')
      .insert({
        board_id: boardId,
        text: text.trim(),
        type,
        author: author?.trim() || null
      })
      .select()
      .single()

    console.log('🔍 DEBUG: Insert result:')
    console.log('🔍 DEBUG: - Error:', error)
    console.log('🔍 DEBUG: - Data:', data)
    console.log('🔍 DEBUG: - Inserted board_id:', data?.board_id)

    if (error) {
      console.error('Error creating note:', error)
      return { success: false, error: 'Error creating note' }
    }

    console.log('🔍 DEBUG: Successfully created note:', data)
    return { success: true, note: data }
  } catch (error) {
    console.error('Unexpected error creating note:', error)
    return { success: false, error: 'Unexpected error' }
  }
}

export async function getNotes(boardId: string): Promise<{ success: boolean; notes?: Note[]; error?: string }> {
  try {
    console.log('🔍 DEBUG: Fetching notes for board:', boardId)
    console.log('🔍 DEBUG: Board ID type:', typeof boardId, 'length:', boardId?.length)
    
    // Try a simple query first without any filters
    const { data: allNotes, error: allError } = await supabase
      .from('notes')
      .select('*')
    
    console.log('🔍 DEBUG: All notes query result:')
    console.log('🔍 DEBUG: - Error:', allError)
    console.log('🔍 DEBUG: - Data:', allNotes)
    console.log('🔍 DEBUG: - Data length:', allNotes?.length)
    
    // Now try the filtered query
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('board_id', boardId)

    console.log('🔍 DEBUG: Filtered query result:')
    console.log('🔍 DEBUG: - Error:', error)
    console.log('🔍 DEBUG: - Data:', data)
    console.log('🔍 DEBUG: - Data length:', data?.length)
    console.log('🔍 DEBUG: - Board ID used in filter:', boardId)

    if (error) {
      console.error('Error fetching notes:', error)
      return { success: false, error: 'Fout bij ophalen notes' }
    }

    console.log('🔍 DEBUG: Raw notes from database:', data)
    
    console.log('🔍 DEBUG: Returning notes directly (no conversion needed):', data)
    return { success: true, notes: data || [] }
  } catch (error) {
    console.error('Unexpected error fetching notes:', error)
    return { success: false, error: 'Onverwachte fout' }
  }
}

export async function deleteNote(noteId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)

    if (error) {
      console.error('Error deleting note:', error)
      return { success: false, error: 'Fout bij verwijderen note' }
    }

    return { success: true }
  } catch (error) {
    console.error('Unexpected error deleting note:', error)
    return { success: false, error: 'Onverwachte fout' }
  }
}
