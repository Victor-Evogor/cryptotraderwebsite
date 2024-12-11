"use client"

import { useTheme } from "next-themes"
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="fixed top-4 right-4 p-2 rounded-lg bg-purple-800/30 hover:bg-purple-700/30 transition-colors z-10"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <SunIcon className="h-6 w-6 text-yellow-300" />
      ) : (
        <MoonIcon className="h-6 w-6 text-gray-800" />
      )}
    </button>
  )
}
