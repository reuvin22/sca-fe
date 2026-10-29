import { Moon, Sun } from 'lucide-react'

export const THEMES = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
]

// Each palette has 5 colors, darkest to lightest:
// 1 = hover, 2 = buttons, 3 = accents, 4 = light accents, 5 = background
export const PALETTES = [
  { id: 'ocean', label: 'Ocean', colors: ['#023e8a', '#0077b6', '#00b4d8', '#90e0ef', '#e8f7fb'] },
  { id: 'forest', label: 'Forest', colors: ['#1b4332', '#2d6a4f', '#52b788', '#95d5b2', '#edf7f0'] },
  { id: 'sunset', label: 'Sunset', colors: ['#7c2d12', '#e85d04', '#f48c06', '#ffba08', '#fff6e9'] },
  { id: 'rose', label: 'Rose', colors: ['#590d22', '#c9184a', '#ff4d6d', '#ffb3c1', '#fff0f3'] },
  { id: 'grape', label: 'Grape', colors: ['#3c096c', '#5a189a', '#9d4edd', '#c77dff', '#f6efff'] },
]

const STORAGE_KEY = 'sca-theme'
// `palette` is optional (null = default colors)
const DEFAULT_THEME = { theme: 'light', palette: null }

// Saved choice for this browser. Falls back to light if storage is blocked.
export function loadTheme() {
  try {
    const saved = { ...DEFAULT_THEME, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) }
    // Older saves used theme 'custom'
    return { ...saved, theme: saved.theme === 'dark' ? 'dark' : 'light' }
  } catch {
    return DEFAULT_THEME
  }
}

export function saveTheme(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // Storage blocked: the theme still works until refresh
  }
}

// Sets the theme attribute and palette colors that index.css uses
export function applyTheme({ theme, palette }) {
  const root = document.documentElement
  root.dataset.theme = theme
  const colors = PALETTES.find((item) => item.id === palette)?.colors
  if (!colors) return delete root.dataset.palette
  root.dataset.palette = palette
  colors.forEach((color, i) => root.style.setProperty(`--palette-${i + 1}`, color))
}
