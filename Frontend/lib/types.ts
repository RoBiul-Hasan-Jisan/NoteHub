

// lib/types.ts - Updated type definitions

export type NoteColor = 'yellow' | 'mint' | 'blue' | 'peach' | 'lavender'

export type PaperStyle = 
  | 'vintage_yellow'    // Classic lined yellow paper
  | 'crumpled_white'    // Wrinkled white paper with texture
  | 'pastel_pink'       // Kawaii pink with dots
  | 'neon_cyber'        // Futuristic grid paper with neon glow
  | 'cork_board'        // Natural cork texture
  | 'holographic'       // Iridescent gradient with shimmer

export type PinStyle = 
  | 'classic'   // Traditional push pin
  | 'heart'     // Heart-shaped pin with pulse
  | 'star'      // Star pin with rotation
  | 'sparkle'   // Sparkles with particles
  | 'clip'      // Paper clip
  | 'gem'       // Diamond/gem shape

export interface Note {
  id: string
  title: string
  content: string
  color: NoteColor
  paperStyle?: PaperStyle      // NEW: Paper texture style
  pinStyle?: PinStyle          // NEW: Pin/tack style
  isPinned: boolean
  createdAt: Date
  updatedAt?: Date
  tags?: string[]              // Optional: for categorization
  priority?: 'low' | 'medium' | 'high'  // Optional: priority level
}

export interface NoteFilter {
  isPinned?: boolean
  paperStyle?: PaperStyle
  tags?: string[]
  searchQuery?: string
}

// Helper function to create a new note with defaults
export function createNote(partial: Partial<Note>): Note {
  return {
    id: crypto.randomUUID(),
    title: '',
    content: '',
    color: 'yellow',
    paperStyle: 'vintage_yellow',
    pinStyle: 'classic',
    isPinned: false,
    createdAt: new Date(),
    ...partial,
  }
}

// Color palette for quick reference
export const PAPER_STYLE_INFO: Record<PaperStyle, { name: string; description: string; emoji: string }> = {
  vintage_yellow: {
    name: 'Vintage Yellow',
    description: 'Classic lined notebook paper with warm tones',
    emoji: '📒',
  },
  crumpled_white: {
    name: 'Crumpled White',
    description: 'Wrinkled white paper with realistic texture',
    emoji: '📄',
  },
  pastel_pink: {
    name: 'Pastel Pink',
    description: 'Kawaii-style pink paper with polka dots',
    emoji: '🌸',
  },
  neon_cyber: {
    name: 'Neon Cyber',
    description: 'Futuristic grid paper with glowing effects',
    emoji: '🌐',
  },
  cork_board: {
    name: 'Cork Board',
    description: 'Natural cork texture for a rustic feel',
    emoji: '🪵',
  },
  holographic: {
    name: 'Holographic',
    description: 'Iridescent rainbow gradient with shimmer',
    emoji: '✨',
  },
}

export const PIN_STYLE_INFO: Record<PinStyle, { name: string; description: string; emoji: string }> = {
  classic: {
    name: 'Classic Pin',
    description: 'Traditional silver push pin',
    emoji: '📌',
  },
  heart: {
    name: 'Heart',
    description: 'Romantic heart with pulse animation',
    emoji: '❤️',
  },
  star: {
    name: 'Star',
    description: 'Golden star with rotation',
    emoji: '⭐',
  },
  sparkle: {
    name: 'Sparkle',
    description: 'Magical sparkles with particles',
    emoji: '✨',
  },
  clip: {
    name: 'Paper Clip',
    description: 'Simple paper clip attachment',
    emoji: '📎',
  },
  gem: {
    name: 'Gem',
    description: 'Precious diamond shape with glow',
    emoji: '💎',
  },
}