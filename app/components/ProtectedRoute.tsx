// Update the ProtectedRoute component to use localStorage directly
"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "../services/authService"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const auth = isAuthenticated()
      setAuthenticated(auth)
      setLoading(false)

      if (!auth) {
        router.push("/login")
      }
    }

    checkAuth()

    // Set up an interval to periodically check authentication
    const interval = setInterval(checkAuth, 2000)

    return () => clearInterval(interval)
  }, [router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <Loader2 className="h-8 w-8 text-pokemon-blue animate-spin" />
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return <>{children}</>
}

