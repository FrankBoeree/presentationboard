'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { castVote } from '@/actions/votes'
import { getDeviceId } from '@/utils/deviceId'

interface VoteButtonProps {
  noteId: string
  voteCount: number
  hasVoted: boolean
  isChecking?: boolean
  onVote?: (noteId: string, newVoteCount: number) => void
  isHighVotes?: boolean
}

export function VoteButton({ noteId, voteCount, hasVoted, isChecking = false, onVote, isHighVotes = false }: VoteButtonProps) {
  const [isVoting, setIsVoting] = useState(false)
  const [localVoteCount, setLocalVoteCount] = useState(voteCount)
  const [localHasVoted, setLocalHasVoted] = useState(hasVoted)

  const handleVote = async () => {
    if (localHasVoted || isVoting) return

    setIsVoting(true)
    const deviceId = getDeviceId()

    try {
      const result = await castVote(noteId, deviceId)
      if (result.success && result.newVoteCount !== undefined) {
        setLocalVoteCount(result.newVoteCount)
        setLocalHasVoted(true)
        onVote?.(noteId, result.newVoteCount)
      } else {
        console.error('Vote failed:', result.error)
      }
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setIsVoting(false)
    }
  }

  if (isChecking) {
    return (
      <div className={`vote-button ${isHighVotes ? 'vote-button-high-votes' : 'vote-button-inactive'} opacity-50`}>
        <Heart size={16} />
        <span>{localVoteCount}</span>
      </div>
    )
  }

  const getButtonClass = () => {
    if (isHighVotes) {
      return localHasVoted ? 'vote-button-high-votes' : 'vote-button-high-votes'
    }
    return localHasVoted ? 'vote-button-active' : 'vote-button-inactive'
  }

  return (
    <button
      onClick={handleVote}
      disabled={localHasVoted || isVoting}
      className={`vote-button ${getButtonClass()} ${isVoting ? 'opacity-50' : ''}`}
      title={localHasVoted ? 'You have already voted' : 'Vote'}
    >
      <Heart size={16} className={localHasVoted ? 'fill-current' : ''} />
      <span>{localVoteCount}</span>
    </button>
  )
}
