import type React from "react"
// Custom layout for the login page without sidebar or header
import "../globals.css"

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen w-full bg-gradient-to-br from-pokedex-red to-pokemon-blue">{children}</div>
}

