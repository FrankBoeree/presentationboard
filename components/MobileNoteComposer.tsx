'use client'

import { useState, useEffect } from 'react'
import { Send, X } from 'lucide-react'
import { createNote } from '@/actions/notes'

interface MobileNoteComposerProps {
  boardId: string
  boardCode: string
  boardLocked: boolean
  onNoteCreated?: () => void
}

// Simple rate limiter
let lastAction = 0
const minInterval = 2000 // 2 seconds

const canPerformAction = () => {
  const now = Date.now()
  return now - lastAction >= minInterval
}

const recordAction = () => {
  lastAction = Date.now()
}

const getTimeUntilNextAction = () => {
  const timeSinceLastAction = Date.now() - lastAction
  return Math.max(0, minInterval - timeSinceLastAction)
}

export function MobileNoteComposer({ boardId, boardCode, boardLocked, onNoteCreated }: MobileNoteComposerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState('')
  const [type, setType] = useState<'Vraag' | 'Idee'>('Vraag')
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
        setIsOpen(false)
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

  const handleClose = () => {
    setIsOpen(false)
    setError('')
  }

  const remainingChars = 240 - text.length

  return (
    <>
      {/* Sticky Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
        <div className="bg-white border-t border-gray-200 p-6">
          <button
            onClick={() => setIsOpen(true)}
            disabled={boardLocked}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-2xl py-4 px-6 shadow-lg transition-colors duration-200 flex items-center justify-center gap-2"
            title="Add note"
          >
            <Send size={20} />
            <span className="font-medium">Add Note</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 animate-fade-in"
            onClick={handleClose}
          />
          
          {/* Slide-up Panel */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transform animate-slide-up">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Add Note</h2>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Type
                </label>
                        <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('Vraag')}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      type === 'Vraag'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                    }`}
                    disabled={isSubmitting || boardLocked}
                  >
                    Question
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('Idee')}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      type === 'Idee'
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                    }`}
                    disabled={isSubmitting || boardLocked}
                  >
                    Idea
                  </button>
                </div>
              </div>

              {/* Text Input */}
              <div>
                <label htmlFor="mobile-text" className="block text-sm font-medium text-gray-700 mb-2">
                  Note
                </label>
                <textarea
                  id="mobile-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write your note here..."
                  maxLength={240}
                  rows={4}
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
                <label htmlFor="mobile-author" className="block text-sm font-medium text-gray-700 mb-2">
                  Your name (optional)
                </label>
                <input
                  id="mobile-author"
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
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || boardLocked || !text.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {isSubmitting ? 'Placing...' : 'Place Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
