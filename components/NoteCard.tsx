'use client'

import { useState } from 'react'
import { Trash2, Pin, Palette } from 'lucide-react'
import type { Note, NoteColor } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NoteCardProps {
  note: Note
  onUpdate: (id: string, updates: Partial<Note>) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string) => void
}

const colorMap: Record<NoteColor, string> = {
  yellow: 'bg-(--note-yellow)',
  mint: 'bg-(--note-mint)',
  lavender: 'bg-(--note-lavender)',
  peach: 'bg-(--note-peach)',
  blue: 'bg-(--note-blue)',
}

const colorOptions: NoteColor[] = ['yellow', 'mint', 'lavender', 'peach', 'blue']

export function NoteCard({
  note,
  onUpdate,
  onDelete,
  onTogglePin,
}: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleSave = () => {
    onUpdate(note.id, { title, content })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTitle(note.title)
    setContent(note.content)
    setIsEditing(false)
  }

  const baseClasses =
    'rounded-xl border-2 border-opacity-20 p-5 shadow-md transition-all duration-200 hover:shadow-lg'

  return (
    <div
      className={cn(
        baseClasses,
        colorMap[note.color],
        'dark:opacity-90 text-foreground'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg font-semibold bg-transparent border-b-2 border-current outline-none mb-2"
              placeholder="Note title"
              autoFocus
            />
          ) : (
            <h3 className="text-lg font-semibold text-foreground line-clamp-2">
              {title || 'Untitled'}
            </h3>
          )}
        </div>
        <button
          onClick={() => onTogglePin(note.id)}
          className={cn(
            'flex-shrink-0 p-1.5 rounded-lg transition-all',
            note.isPinned
              ? 'bg-primary/30 text-primary'
              : 'hover:bg-white/20 text-foreground/60'
          )}
          title={note.isPinned ? 'Unpin note' : 'Pin note'}
        >
          <Pin className="w-4 h-4" fill={note.isPinned ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div className="mb-4">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full text-sm bg-transparent border-2 border-current rounded p-2 outline-none resize-none h-24"
            placeholder="Start typing..."
          />
        ) : (
          <p className="text-sm text-foreground/80 line-clamp-4 whitespace-pre-wrap leading-relaxed">
            {content || 'No content'}
          </p>
        )}
      </div>

      {/* Category Badge */}
      {note.category && !isEditing && (
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="inline-block text-xs font-medium bg-white/20 text-foreground/70 px-2 py-1 rounded-full">
            {note.category}
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-2 justify-between">
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-all"
            title="Change color"
          >
            <Palette className="w-4 h-4 text-foreground/60" />
          </button>

          {showColorPicker && (
            <div className="absolute bottom-full left-0 mb-2 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-border flex gap-2 z-10">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    onUpdate(note.id, { color })
                    setShowColorPicker(false)
                  }}
                  className={cn(
                    'w-6 h-6 rounded-full border-2 transition-all',
                    colorMap[color],
                    note.color === color ? 'border-foreground' : 'border-transparent'
                  )}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleCancel}
              variant="outline"
              className="text-xs h-7 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="text-xs h-7 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Save
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs px-3 py-1.5 hover:bg-white/20 rounded-lg transition-all text-foreground/70 font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-all text-destructive/70 hover:text-destructive"
              title="Delete note"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
