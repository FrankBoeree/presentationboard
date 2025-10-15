'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { BoardHeader } from '@/components/BoardHeader'
import { NoteCard } from '@/components/NoteCard'
import { NoteComposer } from '@/components/NoteComposer'
import { MobileNoteComposer } from '@/components/MobileNoteComposer'
import { FilterBar } from '@/components/FilterBar'
import { joinBoard } from '@/actions/boards'
import { getNotes, deleteNote, Note } from '@/actions/notes'
import { getClientSupabase } from '@/lib/supabase'
import { Board } from '@/actions/boards'

type FilterType = 'All' | 'Vraag' | 'Idee'
type SortType = 'Popular' | 'Recent'

export default function BoardPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string

  const [board, setBoard] = useState<Board | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('All')
  const [selectedSort, setSelectedSort] = useState<SortType>('Popular')

  // Load board and initial notes
  useEffect(() => {
    const loadBoard = async () => {
      try {
        const boardResult = await joinBoard(code)
        if (boardResult.success && boardResult.board) {
          setBoard(boardResult.board)
          
          const notesResult = await getNotes(boardResult.board.id)
          if (notesResult.success && notesResult.notes) {
            setNotes(notesResult.notes)
          }
        } else {
          setError(boardResult.error || 'Board not found')
        }
      } catch (error) {
        console.error('Error loading board:', error)
        setError('Error loading board')
      } finally {
        setIsLoading(false)
      }
    }

    if (code) {
      loadBoard()
    }
  }, [code])

  // Setup realtime subscription
  useEffect(() => {
    if (!board) return

    const supabase = getClientSupabase()
    
    // Subscribe to notes changes
    const notesChannel = supabase
      .channel(`board-${board.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
          filter: `board_id=eq.${board.id}`
        },
        (payload) => {
          console.log('Notes change:', payload)
          
          if (payload.eventType === 'INSERT') {
            const newNote = payload.new as Note
            setNotes(prev => {
              const exists = prev.some(note => note.id === newNote.id)
              if (!exists) {
                return [newNote, ...prev]
              }
              return prev
            })
          } else if (payload.eventType === 'UPDATE') {
            const updatedNote = payload.new as Note
            setNotes(prev => prev.map(note => 
              note.id === updatedNote.id ? updatedNote : note
            ))
          } else if (payload.eventType === 'DELETE') {
            const deletedNote = payload.old as Note
            setNotes(prev => prev.filter(note => note.id !== deletedNote.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(notesChannel)
    }
  }, [board])

  // Filter and sort notes
  useEffect(() => {
    let filtered = notes

    // Apply filter
    if (selectedFilter !== 'All') {
      filtered = filtered.filter(note => note.type === selectedFilter)
    }

    // Apply sort
    if (selectedSort === 'Popular') {
      filtered = filtered.sort((a, b) => {
        if (b.votes !== a.votes) return b.votes - a.votes
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
    } else {
      filtered = filtered.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    }

    setFilteredNotes(filtered)
  }, [notes, selectedFilter, selectedSort])

  const handleNoteCreated = useCallback(() => {
    // Note will be added via realtime subscription
  }, [])

  const handleVote = useCallback((noteId: string, newVoteCount: number) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, votes: newVoteCount } : note
    ))
  }, [])

  const handleNoteDelete = useCallback(async (noteId: string) => {
    try {
      const result = await deleteNote(noteId)
      if (result.success) {
        setNotes(prev => prev.filter(note => note.id !== noteId))
      }
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }, [])

  const handleLockToggle = useCallback((locked: boolean) => {
    if (board) {
      setBoard(prev => prev ? { ...prev, locked } : null)
    }
  }, [board])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Board loading...</p>
        </div>
      </div>
    )
  }

  if (error || !board) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Board not found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || 'The board with this code does not exist or is no longer available.'}
          </p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to start
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <BoardHeader 
        board={board} 
        isPresenter={false}
        onLockToggle={handleLockToggle}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Notes List */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Filter Bar */}
            <FilterBar
              selectedFilter={selectedFilter}
              selectedSort={selectedSort}
              onFilterChange={setSelectedFilter}
              onSortChange={setSelectedSort}
              noteCount={filteredNotes.length}
            />

            {/* Notes */}
            <div className="space-y-6 lg:space-y-8">
              {filteredNotes.length === 0 ? (
                <div className="text-center py-8 lg:py-12">
                  <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gray-100 rounded-full mb-4">
                    <span className="text-xl lg:text-2xl">💭</span>
                  </div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">
                    No notes yet
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600">
                    {selectedFilter === 'All' 
                      ? 'Be the first to place a note!'
                      : `No ${selectedFilter.toLowerCase()}s found.`
                    }
                  </p>
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    isPresenter={false}
                    onVote={handleVote}
                    onDelete={handleNoteDelete}
                  />
                ))
              )}
            </div>
          </div>

          {/* Desktop Note Composer */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8">
              <NoteComposer
                boardId={board.id}
                boardCode={board.code}
                boardLocked={board.locked}
                onNoteCreated={handleNoteCreated}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Note Composer */}
      <MobileNoteComposer
        boardId={board.id}
        boardCode={board.code}
        boardLocked={board.locked}
        onNoteCreated={handleNoteCreated}
      />
    </div>
  )
}
