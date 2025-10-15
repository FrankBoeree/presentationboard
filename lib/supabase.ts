import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a single client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client-side client for direct use
export const getClientSupabase = () => {
  return supabase
}

export type Database = {
  public: {
    Tables: {
      boards: {
        Row: {
          id: string
          code: string
          title: string
          created_at: string
          locked: boolean
        }
        Insert: {
          id?: string
          code: string
          title: string
          created_at?: string
          locked?: boolean
        }
        Update: {
          id?: string
          code?: string
          title?: string
          created_at?: string
          locked?: boolean
        }
      }
      notes: {
        Row: {
          id: string
          board_id: string
          text: string
          type: 'Vraag' | 'Idee'
          author: string | null
          votes: number
          created_at: string
        }
        Insert: {
          id?: string
          board_id: string
          text: string
          type: 'Vraag' | 'Idee'
          author?: string | null
          votes?: number
          created_at?: string
        }
        Update: {
          id?: string
          board_id?: string
          text?: string
          type?: 'Vraag' | 'Idee'
          author?: string | null
          votes?: number
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          note_id: string
          device_id: string
          created_at: string
        }
        Insert: {
          id?: string
          note_id: string
          device_id: string
          created_at?: string
        }
        Update: {
          id?: string
          note_id?: string
          device_id?: string
          created_at?: string
        }
      }
    }
    Functions: {
      upvote_note: {
        Args: {
          note_id_param: string
          device_id_param: string
        }
        Returns: number
      }
      generate_board_code: {
        Args: {}
        Returns: string
      }
    }
  }
}
