'use client'

import { useState, useRef } from 'react'
import { Trash2, Pin, Palette, Check, Star, Heart, Sparkles, Clock, MoreVertical, Share2, Copy, Maximize2, Minimize2 } from 'lucide-react'
import type { Note } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface NoteCardProps {
  note: Note
  onUpdate: (id: string, updates: Partial<Note>) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string) => void
  index?: number
}

// Enhanced paper styles with more variety
const paperStyles = {
  vintage_yellow: {
    className: `
      bg-gradient-to-br from-[#fff9e6] via-[#ffeb99] to-[#ffd966]
      border-l-4 sm:border-l-8 border-l-amber-500/30
      shadow-[8px_8px_20px_rgba(0,0,0,0.15),inset_-2px_-2px_6px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.5)]
      before:absolute before:inset-0 before:opacity-70
      before:bg-[repeating-linear-gradient(transparent,transparent_28px,rgba(173,133,100,0.4)_28px,rgba(173,133,100,0.4)_29px)]
      before:pointer-events-none
      hover:shadow-[12px_12px_30px_rgba(0,0,0,0.2)]
    `,
    font: "font-['Indie_Flower',_'Patrick_Hand',_cursive]",
    textColor: 'text-amber-950',
  },
  
  crumpled_white: {
    className: `
      bg-gradient-to-br from-white via-gray-50 to-gray-100
      border-l-4 sm:border-l-8 border-l-blue-400/30
      shadow-[8px_8px_20px_rgba(0,0,0,0.2),inset_4px_4px_8px_rgba(0,0,0,0.03)]
      before:absolute before:inset-0 before:opacity-100
      before:bg-[radial-gradient(circle_at_30%_40%,rgba(0,0,0,0.02)_1px,transparent_1px)]
      before:pointer-events-none
      after:absolute after:inset-0
      after:bg-[repeating-linear-gradient(transparent,transparent_28px,rgba(100,149,237,0.25)_28px,rgba(100,149,237,0.25)_29px)]
      after:pointer-events-none after:opacity-80
      hover:shadow-[10px_10px_25px_rgba(0,0,0,0.25)]
    `,
    font: "font-['Segoe_Print',_sans-serif]",
    textColor: 'text-slate-900',
  },
  
  pastel_pink: {
    className: `
      bg-gradient-to-br from-[#fff0f5] via-[#ffe4ec] to-[#ffc9db]
      border-l-4 sm:border-l-8 border-l-pink-500/50 border-r-2 border-r-pink-200/20
      shadow-[6px_6px_15px_rgba(255,105,180,0.3),inset_0_2px_4px_rgba(255,255,255,0.6)]
      before:absolute before:inset-0 before:opacity-40
      before:bg-[radial-gradient(circle,rgba(255,182,193,0.4)_1px,transparent_1px)]
      before:bg-[length:20px_20px]
      before:pointer-events-none
      after:absolute after:inset-0
      after:bg-[repeating-linear-gradient(transparent,transparent_28px,rgba(255,182,193,0.3)_28px,rgba(255,182,193,0.3)_29px)]
      after:pointer-events-none after:opacity-90
      hover:shadow-[8px_8px_20px_rgba(255,105,180,0.4)]
    `,
    font: "font-['Comic_Sans_MS',_'Chalkboard',_cursive]",
    textColor: 'text-rose-900',
  },
  
  neon_cyber: {
    className: `
      bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#252550]
      border-2 sm:border-4 border-cyan-400/40
      shadow-[0_0_20px_rgba(0,255,255,0.4),inset_0_0_20px_rgba(0,255,255,0.1)]
      before:absolute before:inset-0 before:opacity-30
      before:bg-[repeating-linear-gradient(0deg,transparent,transparent_19px,rgba(0,255,255,0.2)_19px,rgba(0,255,255,0.2)_20px)]
      before:pointer-events-none
      hover:shadow-[0_0_30px_rgba(0,255,255,0.6)]
    `,
    font: "font-['Courier_New',_monospace]",
    textColor: 'text-cyan-300',
  },
  
  cork_board: {
    className: `
      bg-gradient-to-br from-[#d4a574] via-[#c9955e] to-[#b88a52]
      shadow-[6px_6px_18px_rgba(0,0,0,0.4),inset_0_2px_0_rgba(255,255,255,0.2)]
      before:absolute before:inset-0 before:opacity-100
      before:bg-[radial-gradient(ellipse,rgba(139,90,60,0.4)_0%,transparent_50%)]
      before:bg-[length:15px_15px]
      before:pointer-events-none
      hover:shadow-[8px_8px_24px_rgba(0,0,0,0.5)]
    `,
    font: "font-['Georgia',_serif]",
    textColor: 'text-amber-950',
  },
  
  holographic: {
    className: `
      bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200
      border-2 sm:border-4 border-white/50
      shadow-[0_8px_32px_rgba(139,92,246,0.4),inset_0_0_20px_rgba(255,255,255,0.5)]
      before:absolute before:inset-0 before:opacity-60
      before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)]
      before:bg-[length:40px_40px]
      before:pointer-events-none
      hover:shadow-[0_10px_40px_rgba(139,92,246,0.5)]
    `,
    font: "font-['Trebuchet_MS',_sans-serif]",
    textColor: 'text-purple-900',
  },
  
  midnight_blue: {
    className: `
      bg-gradient-to-br from-[#0a0a2a] via-[#1a1a3e] to-[#2a2a4a]
      border-2 sm:border-4 border-indigo-500/40
      shadow-[0_0_30px_rgba(99,102,241,0.3),inset_0_0_15px_rgba(99,102,241,0.1)]
      before:absolute before:inset-0 before:opacity-20
      before:bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_2px)]
      before:bg-[length:30px_30px]
      before:pointer-events-none
      hover:shadow-[0_0_40px_rgba(99,102,241,0.4)]
    `,
    font: "font-['Inter',_sans-serif]",
    textColor: 'text-indigo-200',
  },
  
  emerald_green: {
    className: `
      bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50
      border-l-4 sm:border-l-8 border-l-emerald-400/40
      shadow-[6px_6px_18px_rgba(5,150,105,0.15),inset_-1px_-1px_3px_rgba(0,0,0,0.05)]
      before:absolute before:inset-0 before:opacity-60
      before:bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(16,185,129,0.1)_10px,rgba(16,185,129,0.1)_11px)]
      before:pointer-events-none
      hover:shadow-[8px_8px_24px_rgba(5,150,105,0.2)]
    `,
    font: "font-['Quicksand',_sans-serif]",
    textColor: 'text-emerald-900',
  },
}

// Enhanced pin styles
const pinStyles = {
  classic: {
    component: (isPinned: boolean) => (
      <div className="relative">
        <div className={cn(
          "w-4 h-4 sm:w-6 sm:h-6 rounded-full shadow-2xl border-2 transition-all duration-500 ease-out",
          isPinned 
            ? "bg-gradient-to-br from-slate-300 to-slate-500 border-slate-600/40 scale-110" 
            : "bg-slate-200/50 border-slate-400/20 scale-90 opacity-60"
        )}>
          {isPinned && (
            <div className="absolute top-0.5 sm:top-1 left-1 sm:left-1.5 w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-white/80"></div>
          )}
        </div>
      </div>
    ),
  },
  
  heart: {
    component: (isPinned: boolean) => (
      <Heart 
        className={cn(
          "w-4 h-4 sm:w-6 sm:h-6 transition-all duration-500",
          isPinned 
            ? "text-red-500 fill-red-500 scale-125 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" 
            : "text-red-300/40 fill-transparent scale-90"
        )}
      />
    ),
  },
  
  star: {
    component: (isPinned: boolean) => (
      <Star 
        className={cn(
          "w-4 h-4 sm:w-6 sm:h-6 transition-all duration-500",
          isPinned 
            ? "text-yellow-400 fill-yellow-400 scale-125 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" 
            : "text-yellow-300/40 fill-transparent scale-90"
        )}
      />
    ),
  },
  
  sparkle: {
    component: (isPinned: boolean) => (
      <Sparkles 
        className={cn(
          "w-4 h-4 sm:w-6 sm:h-6 transition-all duration-500",
          isPinned 
            ? "text-purple-500 fill-purple-400 scale-125 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" 
            : "text-purple-300/40 fill-transparent scale-90"
        )}
      />
    ),
  },
  
  gem: {
    component: (isPinned: boolean) => (
      <div className={cn(
        "w-4 h-4 sm:w-6 sm:h-6 relative transition-all duration-500",
        isPinned ? "scale-125" : "scale-90 opacity-60"
      )}>
        <div className={cn(
          "absolute inset-0 transition-all duration-500",
          isPinned 
            ? "bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_15px_rgba(59,130,246,0.8)]" 
            : "bg-gradient-to-br from-cyan-300/30 via-blue-400/30 to-purple-500/30"
        )}
        style={{
          clipPath: 'polygon(50% 0%, 100% 40%, 50% 100%, 0% 40%)',
        }}
        />
      </div>
    ),
  },
  
  crystal: {
    component: (isPinned: boolean) => (
      <div className={cn(
        "w-4 h-4 sm:w-6 sm:h-6 relative transition-all duration-500",
        isPinned ? "scale-125" : "scale-90 opacity-60"
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-200/80 to-blue-300/80"
          style={{
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          }}
        />
      </div>
    ),
  },
}

type PaperStyle = keyof typeof paperStyles
type PinStyle = keyof typeof pinStyles

const paperOptions: PaperStyle[] = ['vintage_yellow', 'crumpled_white', 'pastel_pink', 'neon_cyber', 'cork_board', 'holographic', 'midnight_blue', 'emerald_green']
const pinOptions: PinStyle[] = ['classic', 'heart', 'star', 'sparkle', 'gem', 'crystal']

export function NoteCard({
  note,
  onUpdate,
  onDelete,
  onTogglePin,
  index = 0,
}: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showPinPicker, setShowPinPicker] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const cardRef = useRef<HTMLDivElement>(null)

  const currentPaperStyle = (note.paperStyle || 'vintage_yellow') as PaperStyle
  const currentPinStyle = (note.pinStyle || 'classic') as PinStyle

  const paperStyle = paperStyles[currentPaperStyle]
  const PinComponent = pinStyles[currentPinStyle].component

  const animationDelay = `${index * 100}ms`

  const handleSave = () => {
    onUpdate(note.id, { title, content })
    setIsEditing(false)
    toast.success('Note updated successfully!', {
      icon: '📝',
      position: 'top-right',
    })
  }

  const handleCancel = () => {
    setTitle(note.title)
    setContent(note.content)
    setIsEditing(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`)
    toast.info('Note copied to clipboard!', {
      icon: '📋',
      position: 'top-right',
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: note.content,
          url: window.location.href,
        })
        toast.success('Note shared successfully!', {
          icon: '🔗',
          position: 'top-right',
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const wordCount = content?.split(/\s+/).filter(word => word.length > 0).length || 0

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative group transition-all duration-500 hover:z-50',
        'hover:scale-[1.02] sm:hover:-rotate-[0.5deg]',
        paperStyle.className,
        paperStyle.textColor,
        'min-h-[300px] sm:min-h-[350px] rounded-xl p-4 sm:p-7 pt-12 sm:pt-16 overflow-hidden',
        'cursor-pointer select-none',
        'animate-in fade-in slide-in-from-bottom-4',
        note.isPinned ? 'rotate-0' : 'rotate-[0.3deg]',
        isExpanded ? 'fixed inset-4 sm:inset-10 md:inset-20 z-50 !scale-100 !rotate-0 overflow-y-auto' : ''
      )}
      style={{ animationDelay }}
    >
      {/* Pin with glow effect */}
      <div 
        className={cn(
          "absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50 cursor-pointer transition-all duration-300",
          "hover:scale-125 active:scale-110"
        )}
        onClick={() => onTogglePin(note.id)}
      >
        <PinComponent isPinned={note.isPinned} />
      </div>

      {/* Note metadata */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex items-center gap-1 sm:gap-2 opacity-60 text-[10px] sm:text-xs">
        <Clock className="w-2 h-2 sm:w-3 sm:h-3" />
        <span className="hidden sm:inline">{formatDate(note.createdAt)}</span>
        <span className="sm:hidden">{new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
      </div>

      {/* Word count badge */}
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-black/10 backdrop-blur-sm rounded-full text-[10px] sm:text-xs opacity-70">
        {wordCount}w
      </div>

      {/* Content area */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Title */}
        <div className="mb-3 sm:mb-6">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={cn(
                "w-full px-3 sm:px-5 py-2 sm:py-3 text-base sm:text-lg font-bold bg-white/70 backdrop-blur-lg rounded-xl sm:rounded-2xl",
                "border-2 border-white/60 outline-none placeholder:opacity-50",
                "shadow-[0_4px_16px_rgba(0,0,0,0.1)] focus:shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
                "transition-all duration-300",
                paperStyle.textColor
              )}
              placeholder="✨ Note Title"
              autoFocus
            />
          ) : (
            <h3 className={cn(
              "text-lg sm:text-xl font-bold mb-2 pb-2 pr-8 sm:pr-16",
              paperStyle.textColor,
              "border-b-2 border-white/30 truncate"
            )}>
              {title || '✨ Untitled Note'}
            </h3>
          )}
        </div>

        {/* Main content */}
        <div className={cn(
          "pl-2 sm:pl-6 flex-1 overflow-y-auto pr-2",
          "min-h-[150px] sm:min-h-[200px]",
          isExpanded ? "max-h-none" : "max-h-[200px] sm:max-h-[250px]"
        )}>
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={cn(
                "w-full h-full min-h-[150px] sm:min-h-[180px] bg-transparent outline-none resize-none",
                "leading-relaxed text-sm sm:text-lg",
                paperStyle.font,
                paperStyle.textColor,
                "placeholder:opacity-40"
              )}
              placeholder="💭 Start writing..."
            />
          ) : (
            <div className="relative">
              <p className={cn(
                "text-sm sm:text-lg whitespace-pre-wrap leading-relaxed break-words",
                paperStyle.font,
                paperStyle.textColor,
                "opacity-90"
              )}>
                {content || (
                  <span className="opacity-50 italic">
                    Click to add content... ✍️
                  </span>
                )}
              </p>
              
              {!isExpanded && content && content.length > 200 && (
                <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-12 bg-gradient-to-t from-current/20 to-transparent pointer-events-none"></div>
              )}
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className={cn(
          "mt-3 sm:mt-6 flex flex-wrap items-center justify-between gap-2 pt-3 sm:pt-4 border-t-2 border-white/30",
          "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300"
        )}>
          
          {/* Left side: Style pickers */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Paper Style Picker */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowColorPicker(!showColorPicker)
                  setShowPinPicker(false)
                  setShowMoreMenu(false)
                }}
                className="p-1.5 sm:p-2.5 hover:bg-white/40 rounded-lg sm:rounded-xl transition-all duration-200 backdrop-blur-lg border-2 border-white/30 shadow-lg active:scale-95"
                title="Change paper style"
              >
                <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {showColorPicker && (
                <div className="absolute bottom-full left-0 mb-2 sm:mb-4 p-2 sm:p-4 bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border-2 sm:border-4 border-white/60 z-50">
                  <p className="text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3 text-center">🎨 Paper</p>
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
                    {paperOptions.map((style) => (
                      <button
                        key={style}
                        onClick={() => {
                          onUpdate(note.id, { paperStyle: style })
                          setShowColorPicker(false)
                        }}
                        className={cn(
                          'w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl border-2 shadow-lg active:scale-95 transition-all duration-300',
                          currentPaperStyle === style 
                            ? 'ring-2 sm:ring-4 ring-offset-1 sm:ring-offset-2 ring-blue-500 scale-105 sm:scale-110' 
                            : 'border-white/50'
                        )}
                      >
                        <div className={cn(
                          "w-full h-full rounded-lg overflow-hidden",
                          paperStyles[style].className
                        )}>
                          <div className="w-full h-2 sm:h-3 bg-current/20 mt-1 sm:mt-2"></div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pin Style Picker */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowPinPicker(!showPinPicker)
                  setShowColorPicker(false)
                  setShowMoreMenu(false)
                }}
                className="p-1.5 sm:p-2.5 hover:bg-white/40 rounded-lg sm:rounded-xl transition-all duration-200 backdrop-blur-lg border-2 border-white/30 shadow-lg active:scale-95"
                title="Change pin style"
              >
                <Pin className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {showPinPicker && (
                <div className="absolute bottom-full left-0 mb-2 sm:mb-4 p-2 sm:p-4 bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border-2 sm:border-4 border-white/60 z-50">
                  <p className="text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3 text-center">📌 Pin</p>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    {pinOptions.map((style) => (
                      <button
                        key={style}
                        onClick={() => {
                          onUpdate(note.id, { pinStyle: style })
                          setShowPinPicker(false)
                        }}
                        className={cn(
                          'w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl border-2 shadow-lg active:scale-95 transition-all duration-300 flex items-center justify-center bg-white',
                          currentPinStyle === style ? 'ring-2 sm:ring-4 ring-purple-500 ring-offset-1 sm:ring-offset-2 scale-105 sm:scale-110' : ''
                        )}
                      >
                        {pinStyles[style].component(true)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Middle: Quick actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 sm:p-2 hover:bg-white/30 rounded-full transition-all duration-200 backdrop-blur-sm active:scale-90"
              title={isExpanded ? 'Minimize' : 'Expand'}
            >
              {isExpanded ? <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />}
            </button>
            
            <button
              onClick={handleCopy}
              className="p-1.5 sm:p-2 hover:bg-white/30 rounded-full transition-all duration-200 backdrop-blur-sm active:scale-90"
              title="Copy note"
            >
              <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Right side: Edit/Delete/More */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {isEditing ? (
              <div className="flex gap-1.5 sm:gap-3">
                <button
                  onClick={handleCancel}
                  className="px-2.5 sm:px-5 py-1.5 sm:py-2.5 text-xs sm:text-sm font-bold bg-white/80 hover:bg-white rounded-lg sm:rounded-xl border-2 border-gray-300 text-gray-700 transition-all duration-200 active:scale-95 shadow-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-2.5 sm:px-5 py-1.5 sm:py-2.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 rounded-lg sm:rounded-xl shadow-xl transition-all duration-200 active:scale-95 flex items-center gap-1 sm:gap-2"
                >
                  <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Save</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-2.5 sm:px-5 py-1.5 sm:py-2.5 text-xs sm:text-sm font-bold hover:bg-white/40 rounded-lg sm:rounded-xl border-2 border-white/40 transition-all duration-200 active:scale-95 backdrop-blur-lg shadow-lg flex items-center gap-1 sm:gap-2"
                >
                  <span className="text-base sm:text-lg">✏️</span>
                  <span className="hidden sm:inline">Edit</span>
                </button>
                
                {/* More menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="p-1.5 sm:p-2.5 hover:bg-white/40 rounded-lg sm:rounded-xl transition-all duration-200 backdrop-blur-lg border-2 border-white/30 shadow-lg active:scale-95"
                    title="More options"
                  >
                    <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {showMoreMenu && (
                    <div className="absolute right-0 bottom-full mb-2 sm:mb-3 p-2 sm:p-3 bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl border-2 border-white/60 z-50 min-w-[140px] sm:min-w-[160px]">
                      <button
                        onClick={handleShare}
                        className="w-full px-3 sm:px-4 py-1.5 sm:py-2.5 text-left text-xs sm:text-sm hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2"
                      >
                        <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        Share
                      </button>
                      <button
                        onClick={handleCopy}
                        className="w-full px-3 sm:px-4 py-1.5 sm:py-2.5 text-left text-xs sm:text-sm hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2"
                      >
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                        Copy
                      </button>
                      <button
                        onClick={() => onTogglePin(note.id)}
                        className="w-full px-3 sm:px-4 py-1.5 sm:py-2.5 text-left text-xs sm:text-sm hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2"
                      >
                        <Pin className="w-3 h-3 sm:w-4 sm:h-4" />
                        {note.isPinned ? 'Unpin' : 'Pin'}
                      </button>
                      <div className="h-px bg-gray-200 my-1 sm:my-2"></div>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this note?')) {
                            onDelete(note.id)
                            toast.error('Note deleted!', {
                              icon: '🗑️',
                              position: 'top-right',
                            })
                          }
                        }}
                        className="w-full px-3 sm:px-4 py-1.5 sm:py-2.5 text-left text-xs sm:text-sm hover:bg-red-50 text-red-600 rounded-lg transition-all duration-200 flex items-center gap-2 sm:gap-3"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute bottom-1 sm:bottom-2 right-2 sm:right-3 text-[10px] sm:text-xs opacity-20">
        📝 #{index + 1}
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 right-0 w-8 h-8 sm:w-12 sm:h-12 overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
        <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-black/15 to-transparent rotate-45 translate-x-6 sm:translate-x-8 -translate-y-6 sm:-translate-y-8"></div>
      </div>

      {/* Edge lighting effect */}
      <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-hover:border-white/10 rounded-xl transition-all duration-500"></div>
    </div>
  )
}