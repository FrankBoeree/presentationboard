'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Users } from 'lucide-react'
import { joinBoard } from '@/actions/boards'
import { isValidBoardCode } from '@/utils/generateCode'

export default function JoinPage() {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!code.trim()) {
      setError('Code is required')
      return
    }

    const cleanCode = code.trim().toUpperCase()
    
    if (!isValidBoardCode(cleanCode)) {
      setError('Invalid code. Use 6 characters (A-Z, 2-9)')
      return
    }

    setIsJoining(true)
    setError('')

    try {
      const result = await joinBoard(cleanCode)
      
      if (result.success && result.board) {
        // Store name in localStorage for this session
        if (name.trim()) {
          localStorage.setItem(`board-${cleanCode}-name`, name.trim())
        }
        
        router.push(`/b/${cleanCode}`)
      } else {
        setError(result.error || 'Board not found')
      }
    } catch (error) {
      console.error('Error joining board:', error)
      setError('Unexpected error')
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to start
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join presentation
            </h1>
            <p className="text-gray-600">
              Enter the code you received from the presenter
            </p>
          </div>

          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Board code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Bijvoorbeeld: ABC123"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-lg font-mono text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                6 tekens bestaande uit letters A-Z en cijfers 2-9
              </p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Your name (optional)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should we call you?"
                maxLength={50}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="mt-2 text-sm text-gray-500">
                Your name will be shown with your notes (optional)
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isJoining || !code.trim()}
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white text-lg font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isJoining ? (
                'Connecting...'
              ) : (
                <>
                  <Users className="w-5 h-5 mr-2" />
                  Join
                </>
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-500">
              <p className="mb-2">
                <strong>No code?</strong> Ask the presenter to share the code.
              </p>
              <p>
                The code is usually shown on screen or shared via chat/email.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
