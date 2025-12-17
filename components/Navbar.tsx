"use client"

import { useEffect, useState } from "react"

export function Navbar() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null
    if (stored) {
      setTheme(stored)
      document.documentElement.classList.toggle("dark", stored === "dark")
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light"
    setTheme(next)
    localStorage.setItem("theme", next)
    document.documentElement.classList.toggle("dark", next === "dark")
  }

  return (
    <header className="h-14 border-b border-gray-200 dark:border-gray-800 
      bg-white dark:bg-black flex items-center justify-between px-6">

      <span className="text-sm font-medium tracking-wide">
        Welcome, Presales
      </span>

      <button
        onClick={toggleTheme}
        className="text-xs px-3 py-1 rounded border
          border-gray-300 dark:border-gray-700
          hover:bg-gray-100 dark:hover:bg-gray-900 transition"
      >
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </button>
    </header>
  )
}
