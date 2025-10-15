'use client'

import { useState, useEffect } from 'react'
import { Send } from 'lucide-react'
import { createNote } from '@/actions/notes'

interface NoteComposerProps {
  boardId: string
  boardCode: string
  boardLocked: boolean
  onNoteCreated?: () => void
}

// Simple rate limiter
let lastAction = 0
const minInterval = 10000 // 10 seconds

const canPerformAction = () => {
  const now = Date.now()
  return now - lastAction >= minInterval
}

const recordAction = () => {
  lastAction = Date.now()
}

const getTimeUntilNextAction = () => {
  const now = Date.now()
  const timeSinceLastAction = now - lastAction
  return Math.max(0, minInterval - timeSinceLastAction)
}

export function NoteComposer({ boardId, boardCode, boardLocked, onNoteCreated }: NoteComposerProps) {
  const [text, setText] = useState('')
  const [type, setType] = useState<'Question' | 'Idea'>('Question')
  const [author, setAuthor] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Load stored name from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem(`board-${boardCode}-name`)
      if (storedName) {
        setAuthor(storedName)
      }
    }
  }, [boardCode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (boardLocked) {
      setError('Board is locked')
      return
    }

    if (!canPerformAction()) {
      const timeLeft = Math.ceil(getTimeUntilNextAction() / 1000)
      setError(`Wait ${timeLeft} seconds before placing a new note`)
      return
    }

    if (!text.trim()) {
      setError('Text is required')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const result = await createNote(boardId, text.trim(), type, author.trim() || undefined)
      
      if (result.success) {
        setText('')
        recordAction()
        onNoteCreated?.()
      } else {
        setError(result.error || 'Error placing note')
      }
    } catch (error) {
      console.error('Error creating note:', error)
      setError('Unexpected error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const remainingChars = 240 - text.length

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Type
          </label>
                  <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('Question')}
              className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                    type === 'Question'
                  ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-2 border-blue-300 shadow-lg'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300 hover:shadow-md'
              }`}
              disabled={isSubmitting || boardLocked}
            >
              Question
            </button>
            <button
              type="button"
              onClick={() => setType('Idea')}
              className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                    type === 'Idea'
                  ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-2 border-green-300 shadow-lg'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300 hover:shadow-md'
              }`}
              disabled={isSubmitting || boardLocked}
            >
              Idea
            </button>
          </div>
        </div>

        {/* Text Input */}
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
            Note
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your note here..."
            maxLength={240}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isSubmitting || boardLocked}
            required
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {remainingChars} characters remaining
            </span>
          </div>
        </div>

        {/* Author Input */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
            Your name (optional)
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter your name..."
            maxLength={50}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting || boardLocked}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || boardLocked || !text.trim()}
          className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            'Versturen...'
          ) : (
            <>
              <Send size={16} className="mr-2" />
              Versturen
            </>
          )}
        </button>

        {boardLocked && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
            Board is vergrendeld - nieuwe notes kunnen niet worden geplaatst
          </div>
        )}
      </form>
    </div>
  )
}
