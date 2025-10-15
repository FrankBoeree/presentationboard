'use server'

import { supabase } from '@/lib/supabase'

export async function castVote(noteId: string, deviceId: string): Promise<{ success: boolean; newVoteCount?: number; error?: string }> {
  try {
    if (!noteId || !deviceId) {
      return { success: false, error: 'Ontbrekende parameters' }
    }

    // Use the stored procedure to handle the vote atomically
    const { data, error } = await supabase
      .rpc('upvote_note', {
        note_id_param: noteId,
        device_id_param: deviceId
      })

    if (error) {
      console.error('Error casting vote:', error)
      return { success: false, error: 'Fout bij stemmen' }
    }

    return { success: true, newVoteCount: data }
  } catch (error) {
    console.error('Unexpected error casting vote:', error)
    return { success: false, error: 'Onverwachte fout' }
  }
}

export async function hasVoted(noteId: string, deviceId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('votes')
      .select('id')
      .eq('note_id', noteId)
      .eq('device_id', deviceId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking vote:', error)
      return false
    }

    return !!data
  } catch (error) {
    console.error('Unexpected error checking vote:', error)
    return false
  }
}
