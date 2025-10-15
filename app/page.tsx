'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Users, Sparkles } from 'lucide-react'
import { createBoard } from '@/actions/boards'

export default function HomePage() {
  const [title, setTitle] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setIsCreating(true)
    setError('')

    try {
      const result = await createBoard(title.trim())
      
      if (result.success && result.board) {
        router.push(`/presenter/${result.board.code}`)
      } else {
        setError(result.error || 'Error creating board')
      }
    } catch (error) {
      console.error('Error creating board:', error)
      setError('Unexpected error: ' + (error as Error).message)
    } finally {
      setIsCreating(false)
    }
  }

  const handleJoinDemo = () => {
    router.push('/b/DEMO12')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Presentation Board
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A minimalist presentation board for live feedback and interaction. 
              Share your code and collect ideas, questions and comments in real-time.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Create Board */}
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Create new board
              </h2>
              <p className="text-gray-600">
                Start a new presentation session and share the code with your audience
              </p>
            </div>

            <form onSubmit={handleCreateBoard} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title of your presentation
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="For example: Product Launch Q&A"
                  maxLength={100}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isCreating || !title.trim()}
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCreating ? (
                  'Creating...'
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Create new board
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Join Board */}
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Join presentation
              </h2>
              <p className="text-gray-600">
                Enter the code you received from the presenter
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => router.push('/join')}
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white text-lg font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                <Users className="w-5 h-5 mr-2" />
                Enter code
              </button>

              <div className="text-center">
                <div className="inline-flex items-center text-sm text-gray-500">
                  <span className="w-16 border-t border-gray-300"></span>
                  <span className="px-3">of</span>
                  <span className="w-16 border-t border-gray-300"></span>
                </div>
              </div>

              <button
                onClick={handleJoinDemo}
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 text-lg font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                View demo board
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              How it works
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple, fast and effective. Perfect for presentations, brainstorms and Q&A sessions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Create a board
              </h4>
              <p className="text-gray-600">
                Start a new session and get a unique 6-character code
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Share the code
              </h4>
              <p className="text-gray-600">
                Share the code or QR with your audience via screen, chat or email
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">3</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Collect feedback
              </h4>
              <p className="text-gray-600">
                Receive questions, ideas and comments in real-time
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
