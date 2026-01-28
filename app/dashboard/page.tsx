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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                NoteHub
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, <span className="font-semibold text-foreground">{user.username}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Save Status Indicator */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-secondary/20">
                <div
                  className={`w-2 h-2 rounded-full transition-all ${
                    saveStatus === 'saved'
                      ? 'bg-primary'
                      : saveStatus === 'saving'
                        ? 'bg-yellow-500 animate-pulse'
                        : 'bg-destructive'
                  }`}
                />
                <span className="text-xs font-medium text-muted-foreground">
                  {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Error'}
                </span>
              </div>

              <button
                onClick={handleToggleDarkMode}
                className="p-2 hover:bg-secondary/20 rounded-lg transition-all text-muted-foreground hover:text-foreground"
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
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
        {/* Create New Note Section */}
        <div className="mb-8 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-xl border border-border/50 p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Create New Note</h2>
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
              className="flex-1 bg-input border-border"
            />
            <select
              value={newNoteCategory}
              onChange={(e) => setNewNoteCategory(e.target.value)}
              className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="general">General</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="ideas">Ideas</option>
              <option value="todo">Todo</option>
            </select>
            <Button
              onClick={handleAddNote}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium whitespace-nowrap h-10"
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
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {notes.length === 0 ? 'No notes yet' : 'No matching notes'}
              </h3>
              <p className="text-muted-foreground">
                {notes.length === 0
                  ? 'Create your first note to get started'
                  : 'Try adjusting your search or filters'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onUpdate={updateNote}
                  onDelete={deleteNote}
                  onTogglePin={togglePin}
                />
              ))}
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {notes.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{notes.length}</div>
                <div className="text-xs text-muted-foreground">Total Notes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">
                  {notes.filter((n) => n.isPinned).length}
                </div>
                <div className="text-xs text-muted-foreground">Pinned</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">{categories.length}</div>
                <div className="text-xs text-muted-foreground">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary/70">
                  {notes.reduce((sum, n) => sum + n.content.length, 0).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Characters</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
