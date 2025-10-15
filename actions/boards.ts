'use server'

import { supabase } from '@/lib/supabase'
import { generateBoardCode } from '@/utils/generateCode'

export interface Board {
  id: string
  code: string
  title: string
  created_at: string
  locked: boolean
}

export async function createBoard(title: string): Promise<{ success: boolean; board?: Board; error?: string }> {
  try {
    if (!title || title.trim().length === 0) {
      return { success: false, error: 'Titel is verplicht' }
    }

    if (title.length > 100) {
      return { success: false, error: 'Titel mag maximaal 100 tekens zijn' }
    }

    const code = generateBoardCode()
    
    const { data, error } = await supabase
      .from('boards')
      .insert({
        title: title.trim(),
        code
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating board:', error)
      return { success: false, error: 'Fout bij aanmaken board: ' + error.message }
    }

    return { success: true, board: data }
  } catch (error) {
    console.error('Unexpected error creating board:', error)
    return { success: false, error: 'Onverwachte fout: ' + (error as Error).message }
  }
}

export async function joinBoard(code: string): Promise<{ success: boolean; board?: Board; error?: string }> {
  try {
    if (!code || code.trim().length === 0) {
      return { success: false, error: 'Code is verplicht' }
    }

    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, error: 'Board niet gevonden' }
      }
      console.error('Error joining board:', error)
      return { success: false, error: 'Fout bij laden board' }
    }

    return { success: true, board: data }
  } catch (error) {
    console.error('Unexpected error joining board:', error)
    return { success: false, error: 'Onverwachte fout' }
  }
}

export async function toggleLock(boardId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: currentBoard, error: fetchError } = await supabase
      .from('boards')
      .select('locked')
      .eq('id', boardId)
      .single()

    if (fetchError) {
      console.error('Error fetching board:', fetchError)
      return { success: false, error: 'Board niet gevonden' }
    }

    const { error } = await supabase
      .from('boards')
      .update({ locked: !currentBoard.locked })
      .eq('id', boardId)

    if (error) {
      console.error('Error toggling lock:', error)
      return { success: false, error: 'Fout bij vergrendelen board' }
    }

    return { success: true }
  } catch (error) {
    console.error('Unexpected error toggling lock:', error)
    return { success: false, error: 'Onverwachte fout' }
  }
}

export async function exportCsv(boardId: string): Promise<{ success: boolean; csv?: string; error?: string }> {
  try {
    const { data: notes, error } = await supabase
      .from('notes')
      .select('text, type, votes, created_at')
      .eq('board_id', boardId)
      .order('votes', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notes for export:', error)
      return { success: false, error: 'Fout bij ophalen notes' }
    }

    if (!notes || notes.length === 0) {
      return { success: false, error: 'Geen notes gevonden' }
    }

    // Create CSV content
    const headers = ['Tekst', 'Type', 'Stemmen', 'Datum']
    const csvRows = [
      headers.join(','),
      ...notes.map(note => [
        `"${note.text.replace(/"/g, '""')}"`,
        note.type,
        note.votes,
        new Date(note.created_at).toLocaleString('nl-NL')
      ].join(','))
    ]

    const csv = csvRows.join('\n')
    return { success: true, csv }
  } catch (error) {
    console.error('Unexpected error exporting CSV:', error)
    return { success: false, error: 'Onverwachte fout' }
  }
}
