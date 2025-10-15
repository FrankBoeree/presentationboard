'use client'

import { useState } from 'react'
import { Filter, Clock, TrendingUp } from 'lucide-react'

type FilterType = 'All' | 'Vraag' | 'Idee'
type SortType = 'Popular' | 'Recent'

interface FilterBarProps {
  selectedFilter: FilterType
  selectedSort: SortType
  onFilterChange: (filter: FilterType) => void
  onSortChange: (sort: SortType) => void
  noteCount: number
}

export function FilterBar({ 
  selectedFilter, 
  selectedSort, 
  onFilterChange, 
  onSortChange, 
  noteCount 
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false)

  const filterTypes: FilterType[] = ['All', 'Vraag', 'Idee']
  const sortTypes: SortType[] = ['Popular', 'Recent']

  const getFilterLabel = (filter: FilterType) => {
    switch (filter) {
      case 'Vraag':
        return 'Question'
      case 'Idee':
        return 'Idea'
      default:
        return filter
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Note Count */}
          <div className="text-sm text-gray-600">
            {noteCount} {noteCount === 1 ? 'note' : 'notes'}
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort:</span>
              <div className="flex bg-gray-100 rounded-xl p-1">
                {sortTypes.map((sort) => (
                  <button
                    key={sort}
                    onClick={() => onSortChange(sort)}
                    className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                      selectedSort === sort
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {sort === 'Popular' ? (
                      <TrendingUp size={14} className="inline mr-1" />
                    ) : (
                      <Clock size={14} className="inline mr-1" />
                    )}
                    {sort}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Filter size={14} className="mr-1" />
                Filter
                {selectedFilter !== 'All' && (
                  <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                    {getFilterLabel(selectedFilter)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {filterTypes.map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    onFilterChange(filter)
                    setShowFilters(false)
                  }}
                  className={`px-3 py-1.5 text-sm font-medium rounded-xl transition-colors ${
                    selectedFilter === filter
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {getFilterLabel(filter)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
