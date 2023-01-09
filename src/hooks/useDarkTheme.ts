import { useState, useEffect } from 'react'

export default function useDarkTheme() {
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  const theme = isDarkTheme ? 'dark' : 'light'

  const toggleTheme = () => {
    setIsDarkTheme((d) => !d)
  }

  useEffect(() => {
    const localTheme = localStorage.getItem('theme')
    if (!localTheme) return

    setIsDarkTheme(localTheme === 'dark')
  }, [])

  useEffect(() => {
    // Set theme class on root element
    const root = window.document.documentElement

    isDarkTheme ? root.classList.add('dark') : root.classList.remove('dark')

    localStorage.setItem('theme', theme)
  }, [isDarkTheme])

  return { theme, toggleTheme }
}
