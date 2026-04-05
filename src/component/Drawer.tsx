import React, { useState, useEffect } from 'react'
import { useDatabase } from '../context/DatabaseContext'
import { useDrawer } from '../context/DrawerContext'
import './Drawer.scss'
import Sections from './Sections'
import SupportButton from './SupportButton'

// @ts-ignore
const LAST_BUILD_DATE = __BUILD_DATE__

type Theme = 'light' | 'dark' | 'system'

/**
 * Retrieves the user's stored theme preference from localStorage.
 * Validates the stored value to ensure it's a valid Theme type.
 * @returns The stored theme if valid ('light', 'dark', or 'system'), otherwise defaults to 'system'
 */
const getStoredTheme = (): Theme => {
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  return 'system'
}

/**
 * Applies the specified theme to the document by setting or removing the data-theme attribute.
 * - 'system': Removes data-theme attribute, allowing CSS to use prefers-color-scheme media query
 * - 'light'/'dark': Sets data-theme attribute, which overrides system preference via CSS specificity
 * @param theme - The theme to apply ('light', 'dark', or 'system')
 */
const applyTheme = (theme: Theme): void => {
  if (theme === 'system') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', theme)
  }
}

const SkipToContent = (): JSX.Element => {
  const handleSkip = (e: React.MouseEvent): void => {
    e.preventDefault()
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <a href="#main-content" className="skip-to-content" onClick={handleSkip}>
      Skip to content
    </a>
  )
}

const Drawer = (): JSX.Element => {
  const data = useDatabase()
  const { openDrawer, setOpenDrawer, setSelectedPage } = useDrawer()
  const [theme, setTheme] = useState<Theme>(getStoredTheme)

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const cycleTheme = (): void => {
    setTheme((current) => {
      if (current === 'system') return 'light'
      if (current === 'light') return 'dark'
      return 'system'
    })
  }

  const getThemeLabel = (): string => {
    if (theme === 'system') return 'Auto'
    if (theme === 'light') return 'Light'
    return 'Dark'
  }

  const getThemeIcon = (): string => {
    if (theme === 'system') return '⚙️'
    if (theme === 'light') return '☀️'
    return '🌙'
  }

  if (!data) return <></>
  const { chapters } = data

  const handleResetClick = (): void => {
    const confirmation = confirm('Are you sure you want to reset your progression?')
    if (!confirmation) return

    setSelectedPage({ type: 'chapter', content: chapters[0] })
    document.location = `#${chapters[0].slug}`
    window.scrollTo(0, 0)
    localStorage.clear()
  }

  const handleOverlayClick = (): void => {
    setOpenDrawer(false)
  }

  return (
    <>
      <SkipToContent />
      <div className={`overlay ${openDrawer ? 'show' : ''}`} onClick={handleOverlayClick}></div>
      <nav className={`drawer ${openDrawer ? 'open' : ''}`} aria-label="Main navigation">
        <div className="logo">
          <img src="image/logo/tree.png" alt="" />
          <div className="logo-text">
            <span>Progression</span>
            <span>Checklist</span>
          </div>
        </div>
        <div className="sections">
          <ul>
            <li>
              <a href="index.html" className="home">
                Home
              </a>
            </li>
          </ul>
          <Sections data={data} />
        </div>
        <div className="danger-zone">
          <button className="reset" onClick={handleResetClick} type="button">
            Reset progression
          </button>
        </div>

        <button
          className="theme-toggle"
          onClick={cycleTheme}
          type="button"
          aria-label={`Theme: ${getThemeLabel()}. Click to change.`}
        >
          <span className="theme-label">Theme</span>
          <span className="theme-value" aria-hidden="true">
            {getThemeIcon()} {getThemeLabel()}
          </span>
        </button>

        <a
          className="support-link"
          href="https://www.buymeacoffee.com/ewauq"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SupportButton />
        </a>

        <div className="diminished">Ready for Terraria 1.4.5 and above.</div>
        <div className="diminished">Updated on {LAST_BUILD_DATE}.</div>
        <br />
        <div className="diminished">
          Code by{' '}
          <a
            href="https://github.com/ewauq/terraria-checklist"
            target="_blank"
            rel="noopener noreferrer"
          >
            ewauq
          </a>{' '}
          &{' '}
          <a href="https://github.com/Clonephaze" target="_blank" rel="noopener noreferrer">
            Clonephaze
          </a>
          .
          <br />
          Assets by{' '}
          <a href="https://re-logic.com/" target="_blank" rel="noopener noreferrer">
            Re-Logic
          </a>{' '}
          · Artwork by{' '}
          <a
            href="https://www.deviantart.com/vsewolod/art/Terraria-World-730563825"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vsewolod
          </a>
          .
        </div>
      </nav>
    </>
  )
}

export default Drawer
