'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Note, NoteColor } from '@/lib/types'

export function useNotes(userId: string | undefined) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>(
    'saved'
  )

  // ✅ FIX: initial value required
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load notes from localStorage
  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const storageKey = `notes_${userId}`
    const storedNotes = localStorage.getItem(storageKey)

    if (storedNotes) {
      try {
        setNotes(JSON.parse(storedNotes))
      } catch (e) {
        console.error('Note Hub Failed to parse stored notes:', e)
      }
    }

    setLoading(false)
  }, [userId])

  // Debounced save to localStorage
  const saveNotes = useCallback(
    (updatedNotes: Note[]) => {
      if (!userId) return

      setNotes(updatedNotes)
      setSaveStatus('saving')

      // Clear previous timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      // Debounce save by 500ms
      saveTimeoutRef.current = setTimeout(() => {
        try {
          localStorage.setItem(
            `notes_${userId}`,
            JSON.stringify(updatedNotes)
          )
          setSaveStatus('saved')
          console.log('Note Hub Notes saved for user:', userId)
        } catch (e) {
          console.error('Note Hub Failed to save notes:', e)
          setSaveStatus('error')
        }
      }, 500)
    },
    [userId]
  )

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const addNote = useCallback(
    (title: string, content: string, category: string = 'general') => {
      const newNote: Note = {
        id: `note_${Date.now()}`,
        title,
        content,
        color: 'yellow',
        category,
        isPinned: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      saveNotes([newNote, ...notes])
      return newNote
    },
    [notes, saveNotes]
  )

  const updateNote = useCallback(
    (id: string, updates: Partial<Note>) => {
      const updated = notes.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: Date.now() }
          : note
      )
      saveNotes(updated)
    },
    [notes, saveNotes]
  )

  const deleteNote = useCallback(
    (id: string) => {
      saveNotes(notes.filter((note) => note.id !== id))
    },
    [notes, saveNotes]
  )

  const togglePin = useCallback(
    (id: string) => {
      const note = notes.find((n) => n.id === id)
      if (!note) return
      updateNote(id, { isPinned: !note.isPinned })
    },
    [notes, updateNote]
  )

  const changeColor = useCallback(
    (id: string, color: NoteColor) => {
      updateNote(id, { color })
    },
    [updateNote]
  )

  return {
    notes,
    loading,
    saveStatus,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    changeColor,
  }
}
