// Layout for dashboard pages that includes the sidebar
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import type React from "react"
import { ThemeProvider } from "../contexts/ThemeContext"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <div className="flex h-screen bg-pokeball-gray/10 dark:bg-pokemon-black/90 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-pokedex-white/90 dark:bg-pokemon-black/80 p-2 sm:p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}

