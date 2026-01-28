'use client'

import { useEffect, useState } from 'react'
import type { User } from '@/lib/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate small delay to ensure localStorage is ready
    const timer = setTimeout(() => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (e) {
          console.error('[v0] Failed to parse stored user:', e)
          localStorage.removeItem('user')
        }
      }
      setLoading(false)
    }, 50)

    return () => clearTimeout(timer)
  }, [])

  const login = (username: string) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      username,
    }
    localStorage.setItem('user', JSON.stringify(newUser))
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return { user, loading, login, logout }
}
