"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Menu, X, LogOut, User, Settings, Moon, Sun } from "lucide-react"
import { getCurrentUser, logout, type User as UserType } from "../services/authService"
import { useRouter } from "next/navigation"
import { useTheme } from "../contexts/ThemeContext"

export default function Header() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if user is logged in
    const currentUser = getCurrentUser()
    setUser(currentUser)

    // Set up an event listener to update the user state when localStorage changes
    const handleStorageChange = () => {
      setUser(getCurrentUser())
    }

    window.addEventListener("storage", handleStorageChange)

    // Also check periodically for changes
    const interval = setInterval(() => {
      setUser(getCurrentUser())
    }, 2000)

    // Add click outside listener to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)

    // Toggle the sidebar visibility by adding/removing a class to the sidebar element
    const sidebar = document.querySelector(".sidebar")
    if (sidebar) {
      sidebar.classList.toggle("translate-x-0")
      sidebar.classList.toggle("-translate-x-full")
    }
  }

  const handleLogout = () => {
    logout()
    setUser(null)
    // Force a page reload to ensure all components recognize the auth state
    window.location.href = "/login"
  }

  const navigateToProfile = () => {
    setIsDropdownOpen(false)
    router.push("/dashboard/profile")
  }

  const navigateToSettings = () => {
    setIsDropdownOpen(false)
    router.push("/dashboard/settings")
  }

  return (
    <header className="bg-pokedex-white dark:bg-pokemon-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              onClick={toggleMobileMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-pokedex-black dark:text-pokedex-white hover:text-pokedex-red dark:hover:text-pokemon-yellow hover:bg-pokeball-gray/10 dark:hover:bg-pokeball-gray/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pokedex-red"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">{isMobileMenuOpen ? "Close main menu" : "Open main menu"}</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl md:text-2xl font-bold text-pokedex-red dark:text-pokemon-yellow">
                TrainerWorkOut
              </h1>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                {theme ? (
                  <button
                    onClick={toggleTheme}
                    className="mr-4 p-2 rounded-full text-pokedex-black dark:text-pokedex-white hover:bg-pokeball-gray/10 dark:hover:bg-pokeball-gray/20 focus:outline-none"
                    aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                  >
                    {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  </button>
                ) : null}
                <div className="flex-shrink-0 mr-4">
                  <button className="bg-pokedex-yellow dark:bg-pokemon-blue p-1 rounded-full text-pokedex-black dark:text-pokedex-white hover:bg-pokemon-yellow dark:hover:bg-pokemon-blue/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pokedex-yellow dark:focus:ring-pokemon-blue">
                    <Bell className="h-6 w-6" />
                  </button>
                </div>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center max-w-xs bg-pokedex-white dark:bg-pokemon-black rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pokemon-blue transition-all hover:opacity-90"
                    id="user-menu-button"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="relative">
                      <img
                        className="h-10 w-10 rounded-full object-cover border-2 border-pokemon-blue"
                        src={user.avatar || "/placeholder.svg?height=40&width=40"}
                        alt={user.name}
                      />
                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-pokedex-green border-2 border-pokedex-white dark:border-pokemon-black"></div>
                    </div>
                    <span className="ml-2 text-pokedex-black dark:text-pokedex-white hidden md:block font-medium">
                      {user.name}
                    </span>
                  </button>

                  {isDropdownOpen && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-pokedex-white dark:bg-pokemon-black ring-1 ring-pokemon-black dark:ring-pokeball-gray ring-opacity-5 focus:outline-none z-50 divide-y divide-pokeball-gray/30"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                      tabIndex={-1}
                    >
                      <div className="py-1">
                        <div className="px-4 py-2 text-xs text-pokeball-gray">
                          Signed in as
                          <div className="font-medium text-pokemon-black dark:text-pokedex-white">{user.email}</div>
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={navigateToProfile}
                          className="block w-full text-left px-4 py-2 text-sm text-pokemon-black dark:text-pokedex-white hover:bg-pokemon-yellow/10 dark:hover:bg-pokemon-blue/10 transition-colors"
                          role="menuitem"
                        >
                          <User className="inline-block w-4 h-4 mr-2 text-pokemon-blue" />
                          Your Profile
                        </button>
                        <button
                          onClick={navigateToSettings}
                          className="block w-full text-left px-4 py-2 text-sm text-pokemon-black dark:text-pokedex-white hover:bg-pokemon-yellow/10 dark:hover:bg-pokemon-blue/10 transition-colors"
                          role="menuitem"
                        >
                          <Settings className="inline-block w-4 h-4 mr-2 text-pokemon-blue" />
                          Settings
                        </button>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-pokemon-black dark:text-pokedex-white hover:bg-pokeball-red/10 transition-colors"
                          role="menuitem"
                        >
                          <LogOut className="inline-block w-4 h-4 mr-2 text-pokeball-red" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}

