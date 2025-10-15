'use client'

import { useState } from 'react'
import { Copy, Lock, Unlock, Download, Trash2, Pin } from 'lucide-react'
import { QR } from './QR'
import { Board } from '@/actions/boards'
import { toggleLock, exportCsv } from '@/actions/boards'
import { deleteNote } from '@/actions/notes'

interface BoardHeaderProps {
  board: Board
  isPresenter?: boolean
  onLockToggle?: (locked: boolean) => void
  onNoteDelete?: (noteId: string) => void
}

export function BoardHeader({ board, isPresenter = false, onLockToggle, onNoteDelete }: BoardHeaderProps) {
  const [copied, setCopied] = useState(false)
  const [isLocking, setIsLocking] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const shareUrl = `${window.location.origin}/b/${board.code}`

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(board.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  const handleToggleLock = async () => {
    setIsLocking(true)
    try {
      const result = await toggleLock(board.id)
      if (result.success && onLockToggle) {
        onLockToggle(!board.locked)
      }
    } catch (error) {
      console.error('Error toggling lock:', error)
    } finally {
      setIsLocking(false)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const result = await exportCsv(board.id)
      if (result.success && result.csv) {
        const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `board-${board.code}-${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('Error exporting CSV:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          {/* Board Info */}
          <div className="flex-1">
            <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-2">{board.title}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Code:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-base lg:text-lg font-mono font-semibold text-gray-900">
                  {board.code}
                </code>
                <button
                  onClick={handleCopyCode}
                  className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Copy code"
                >
                  <Copy size={16} />
                </button>
              </div>
              {board.locked && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                  <Lock size={12} className="mr-1" />
                  Locked
                </span>
              )}
            </div>
          </div>

          {/* QR Code - Hidden on mobile, smaller on tablet */}
          <div className="flex-shrink-0 hidden md:block">
            <div className="text-center">
              <QR value={shareUrl} size={100} />
              <p className="text-xs text-gray-600 mt-2">Scan to join</p>
            </div>
          </div>
        </div>

        {/* Presenter Actions */}
        {isPresenter && (
          <div className="mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 lg:gap-3">
              <button
                onClick={handleToggleLock}
                disabled={isLocking}
                className="inline-flex items-center px-2 py-1.5 lg:px-3 lg:py-2 rounded text-sm font-medium transition-colors bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
              >
                {board.locked ? <Unlock size={14} className="mr-1 lg:mr-2" /> : <Lock size={14} className="mr-1 lg:mr-2" />}
                <span className="hidden sm:inline">{board.locked ? 'Unlock board' : 'Lock board'}</span>
                <span className="sm:hidden">{board.locked ? 'Unlock' : 'Lock'}</span>
              </button>

              <button
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center px-2 py-1.5 lg:px-3 lg:py-2 rounded text-sm font-medium transition-colors bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
              >
                <Download size={14} className="mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Export to CSV</span>
                <span className="sm:hidden">Export</span>
              </button>

              <button
                onClick={handleCopyUrl}
                className="inline-flex items-center px-2 py-1.5 lg:px-3 lg:py-2 rounded text-sm font-medium transition-colors bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
              >
                <Copy size={14} className="mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Share this code</span>
                <span className="sm:hidden">Share</span>
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {copied && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
            Code copied to clipboard
          </div>
        )}
      </div>
    </div>
  )
}
