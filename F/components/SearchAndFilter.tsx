'use client'

import { useState } from 'react'
import { Search, X, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchAndFilterProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  categories: string[]
  showPinnedOnly: boolean
  onShowPinnedOnlyChange: (show: boolean) => void
}

export function SearchAndFilter({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  showPinnedOnly,
  onShowPinnedOnlyChange,
}: SearchAndFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search notes by title or content..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10 bg-input border-border w-full"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-secondary/20 hover:bg-secondary/30 rounded-lg transition-all text-sm font-medium text-foreground border border-secondary/30"
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>

        {(selectedCategory || showPinnedOnly) && (
          <button
            onClick={() => {
              onCategoryChange('')
              onShowPinnedOnlyChange(false)
            }}
            className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-all"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onCategoryChange('')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === ''
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-secondary/20 text-foreground border border-border'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-secondary/20 text-foreground border border-border'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Pinned Filter */}
          <div>
            <button
              onClick={() => onShowPinnedOnlyChange(!showPinnedOnly)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                showPinnedOnly
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-muted hover:bg-secondary/20 text-foreground border border-border'
              }`}
            >
              <span>📌 Show Pinned Only</span>
              {showPinnedOnly && <span className="text-xs">✓</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
