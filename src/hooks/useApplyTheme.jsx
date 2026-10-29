import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { applyTheme, saveTheme } from '../utils/themeHelpers'

// Applies and saves the theme whenever it changes. Used once in App.
function useApplyTheme() {
  const theme = useSelector((state) => state.ui.theme)
  const palette = useSelector((state) => state.ui.palette)

  useEffect(() => {
    applyTheme({ theme, palette })
    saveTheme({ theme, palette })
  }, [theme, palette])
}

export default useApplyTheme
