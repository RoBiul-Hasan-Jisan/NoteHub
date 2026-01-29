'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, LogOut, Moon, Sun } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useNotes } from '@/hooks/useNotes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NoteCard } from '@/components/NoteCard'
import { SearchAndFilter } from '@/components/SearchAndFilter'
import type { Note } from '@/lib/types'
import { FancyEyes } from "./FancyEyes"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()
  const { notes, addNote, updateNote, deleteNote, togglePin, saveStatus } = useNotes(user?.id)

  // UI State
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showPinnedOnly, setShowPinnedOnly] = useState(false)
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [newNoteCategory, setNewNoteCategory] = useState('general')

  // Initialize dark mode
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setIsDarkMode(isDark)
  }, [])

  // Redirect if not authenticated (only after loading is complete)
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      // UPDATED: Wood background for loading screen
      <div className="min-h-screen bg-wood-dark flex items-center justify-center">
        <div className="text-center p-8 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    )
  }

  // Get unique categories
  const categories = Array.from(new Set(notes.map((note) => note.category))).sort()

  // Filter notes
  let filteredNotes = notes

  if (searchTerm) {
    filteredNotes = filteredNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  if (selectedCategory) {
    filteredNotes = filteredNotes.filter((note) => note.category === selectedCategory)
  }

  if (showPinnedOnly) {
    filteredNotes = filteredNotes.filter((note) => note.isPinned)
  }

  // Sort: pinned first, then by date
  filteredNotes = filteredNotes.sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1
    }
    return b.updatedAt - a.updatedAt
  })

  const handleAddNote = () => {
    if (newNoteTitle.trim()) {
      addNote(newNoteTitle, '', newNoteCategory)
      setNewNoteTitle('')
      setNewNoteCategory('general')
    }
  }

  const handleToggleDarkMode = () => {
    const html = document.documentElement
    if (html.classList.contains('dark')) {
      html.classList.remove('dark')
      setIsDarkMode(false)
    } else {
      html.classList.add('dark')
      setIsDarkMode(true)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/auth')
  }

  return (
    // UPDATED: Main background set to bg-wood-dark and text to slate-100 (light)
    <div className="min-h-screen bg-wood-dark text-slate-100 font-sans">
      
      {/* Header - Glassmorphism style */}
      <header className="sticky top-0 z-40 bg-black/20 border-b border-white/10 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between relative">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
                NoteHub
              </h1>
              <p className="text-sm text-slate-300">
                Welcome back, <span className="font-semibold text-white">{user.username}</span>
              </p>
            </div>
            
            {/* The Eyes Component */}
            <FancyEyes />
            
            <div className="flex items-center gap-2">
              {/* Save Status Indicator - Darker background */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-black/40 border border-white/5">
                <div
                  className={`w-2 h-2 rounded-full transition-all ${
                    saveStatus === 'saved'
                      ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]'
                      : saveStatus === 'saving'
                        ? 'bg-yellow-400 animate-pulse'
                        : 'bg-red-500'
                  }`}
                />
                
                <span className="text-xs font-medium text-slate-300">
                  {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Error'}
                </span>
              </div>
              
              <button
                onClick={handleToggleDarkMode}
                className="p-2 hover:bg-white/10 rounded-lg transition-all text-slate-300 hover:text-white"
                title="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-red-300 hover:text-red-200 hover:bg-red-500/20"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Create New Note Section - Glass Panel */}
        <div className="mb-8 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📌</span> Create New Note
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder="Note title..."
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddNote()
                }
              }}
              // Updated Input styles for dark background
              className="flex-1 bg-white/10 border-white/10 text-white placeholder:text-white/40 focus:bg-white/20 focus:ring-white/20 focus:border-white/30"
            />
            <select
              value={newNoteCategory}
              onChange={(e) => setNewNoteCategory(e.target.value)}
              // Updated Select styles
              className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20 [&>option]:text-black"
            >
              <option value="general">General</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="ideas">Ideas</option>
              <option value="todo">Todo</option>
            </select>
            <Button
              onClick={handleAddNote}
              className="bg-white text-black hover:bg-white/90 font-semibold whitespace-nowrap h-10 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
            showPinnedOnly={showPinnedOnly}
            onShowPinnedOnlyChange={setShowPinnedOnly}
          />
        </div>

        {/* Notes Grid */}
        <div>
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 bg-black/10 rounded-xl border border-white/5 border-dashed">
              <div className="text-4xl mb-3 opacity-80">📝</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {notes.length === 0 ? 'No notes yet' : 'No matching notes'}
              </h3>
              <p className="text-slate-400">
                {notes.length === 0
                  ? 'Create your first note to get started'
                  : 'Try adjusting your search or filters'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNotes.map((note) => (
                <div key={note.id} className="transform hover:-translate-y-1 transition-transform duration-300">
                  <NoteCard
                    note={note}
                    onUpdate={updateNote}
                    onDelete={deleteNote}
                    onTogglePin={togglePin}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Footer - Updated for dark mode/wood visibility */}
        {notes.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-black/20 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">{notes.length}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Total Notes</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-2xl font-bold text-yellow-400">
                  {notes.filter((n) => n.isPinned).length}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Pinned</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-2xl font-bold text-blue-400">{categories.length}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Categories</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-2xl font-bold text-green-400">
                  {notes.reduce((sum, n) => sum + n.content.length, 0).toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Characters</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}