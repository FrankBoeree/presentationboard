import React from 'react'
import Confetti from 'react-confetti'

/**
 * Simple profanity filter - basic words to filter out
 */
const PROFANITY_WORDS = [
  'spam', 'test', 'lorem', 'ipsum'
]

export function containsProfanity(text: string): boolean {
  const lowerText = text.toLowerCase()
  return PROFANITY_WORDS.some(word => lowerText.includes(word))
}

/**
 * Rate limiting helper - checks if enough time has passed since last action
 */
export class RateLimiter {
  private lastAction: number = 0
  private minInterval: number

  constructor(minIntervalMs: number = 10000) {
    this.minInterval = minIntervalMs
  }

  canPerformAction(): boolean {
    const now = Date.now()
    return now - this.lastAction >= this.minInterval
  }

  recordAction(): void {
    this.lastAction = Date.now()
  }

  getTimeUntilNextAction(): number {
    const now = Date.now()
    const timeSinceLastAction = now - this.lastAction
    return Math.max(0, this.minInterval - timeSinceLastAction)
  }
}

/**
 * Confetti component for celebrations
 */
export function ConfettiEffect({ show, onComplete }: { show: boolean; onComplete?: () => void }) {
  if (!show || typeof window === 'undefined') return null

  return React.createElement(Confetti, {
    width: window.innerWidth,
    height: window.innerHeight,
    recycle: false,
    numberOfPieces: 50,
    gravity: 0.3,
    onConfettiComplete: onComplete,
    colors: ['#0070f3', '#2a7a2a', '#f5f5f5']
  })
}
