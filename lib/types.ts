export type NoteColor = 'yellow' | 'mint' | 'lavender' | 'peach' | 'blue'

export interface Note {
  id: string
  title: string
  content: string
  color: NoteColor
  category: string
  isPinned: boolean
  createdAt: number
  updatedAt: number
}

export interface User {
  id: string
  username: string
}
