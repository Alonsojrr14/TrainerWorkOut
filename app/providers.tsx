"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getCurrentUser, isAuthenticated, logout, type User } from "./services/authService"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      if (isAuthenticated()) {
        setUser(getCurrentUser())
      } else {
        setUser(null)
      }
      setAuthChecked(true)
    }

    checkAuth()

    // Set up an event listener to update the user state when localStorage changes
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener("storage", handleStorageChange)

    // Also check periodically for changes
    const interval = setInterval(checkAuth, 2000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const handleLogin = (user: User) => {
    setUser(user)
  }

  const handleLogout = () => {
    logout()
    setUser(null)
  }

  // Don't render children until we've checked auth
  if (!authChecked) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

