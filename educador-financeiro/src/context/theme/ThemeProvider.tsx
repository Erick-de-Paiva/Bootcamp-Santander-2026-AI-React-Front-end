import { useEffect, useState, type ReactNode } from 'react'
import { ThemeContext, type Theme } from './ThemeContext'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme
    return savedTheme || 'light'
  })

  useEffect(() => {
    localStorage.setItem('theme', theme)
    // Atualiza o atributo data-theme na tag <html>
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
