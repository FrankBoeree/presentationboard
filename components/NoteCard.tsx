'use client'

import { useState, useEffect } from 'react'
import { Heart, Trash2, Pin } from 'lucide-react'
import { Note } from '@/actions/notes'
import { VoteButton } from './VoteButton'
import { getDeviceId } from '@/utils/deviceId'
import { hasVoted } from '@/actions/votes'

interface NoteCardProps {
  note: Note
  isPresenter?: boolean
  onVote?: (noteId: string, newVoteCount: number) => void
  onDelete?: (noteId: string) => void
  onPin?: (noteId: string) => void
}

export function NoteCard({ note, isPresenter = false, onVote, onDelete, onPin }: NoteCardProps) {
  const [hasUserVoted, setHasUserVoted] = useState(false)
  const [isCheckingVote, setIsCheckingVote] = useState(true)

  useEffect(() => {
    const checkVoteStatus = async () => {
      const deviceId = getDeviceId()
      const voted = await hasVoted(note.id, deviceId)
      setHasUserVoted(voted)
      setIsCheckingVote(false)
    }

    checkVoteStatus()
  }, [note.id])

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'Vraag':
        return 'Question'
      case 'Idee':
        return 'Idea'
      default:
        return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Vraag':
        return 'note-type-vraag'
      case 'Idee':
        return 'note-type-idee'
      default:
        return 'note-type-idee'
    }
  }

  const getVoteLevel = (votes: number) => {
    if (votes >= 5) return 'high'
    if (votes >= 2) return 'medium'
    return 'low'
  }

  const getCardClass = (votes: number) => {
    const level = getVoteLevel(votes)
    switch (level) {
      case 'high':
        return 'note-card-high-votes'
      case 'medium':
        return 'note-card-medium-votes'
      default:
        return 'note-card-low-votes'
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
  }

  const voteLevel = getVoteLevel(note.votes)
  const isHighVotes = voteLevel === 'high'

  return (
    <div className={`${getCardClass(note.votes)} animate-fade-in`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Type Badge and Vote Level Indicator */}
          <div className="flex items-center gap-3 mb-4">
            <span className={`note-type-badge ${getTypeColor(note.type)}`}>
              {getTypeLabel(note.type)}
            </span>
            {isHighVotes && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-200 to-orange-200 text-orange-900 shadow-md">
                ⭐ Popular
              </span>
            )}
            <span className="text-xs text-gray-500 font-medium">
              {formatTime(note.created_at)}
            </span>
          </div>

          {/* Note Text */}
          <p className="text-gray-900 mb-4 leading-relaxed text-base font-medium">
            {note.text}
          </p>

          {/* Author */}
          {note.author && (
            <p className="text-sm text-gray-600 mb-4 font-medium">
              — {note.author}
            </p>
          )}

          {/* Vote Button */}
          <VoteButton
            noteId={note.id}
            voteCount={note.votes}
            hasVoted={hasUserVoted}
            isChecking={isCheckingVote}
            onVote={onVote}
            isHighVotes={isHighVotes}
          />
        </div>

        {/* Presenter Actions */}
        {isPresenter && (
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onPin?.(note.id)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Pin note"
            >
              <Pin size={16} />
            </button>
            <button
              onClick={() => onDelete?.(note.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete note"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
