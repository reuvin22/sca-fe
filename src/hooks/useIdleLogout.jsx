import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { logout } from '../services/authService'
import { signOut } from '../store/authSlice'

// Signs the user out after this long without using the page (shared school computers)
export const IDLE_LIMIT_MS = 30 * 60 * 1000
const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'mousemove']
const LAST_ACTIVE_KEY = 'sca_last_active' // shared by all tabs, so using one tab keeps the others signed in
const CHECK_EVERY_MS = 30 * 1000
const SAVE_EVERY_MS = 10 * 1000 // activity is saved at most this often

function readLastActive() {
  try {
    return Number(localStorage.getItem(LAST_ACTIVE_KEY)) || Date.now()
  } catch {
    return Date.now()
  }
}

function saveLastActive(time) {
  try {
    localStorage.setItem(LAST_ACTIVE_KEY, String(time))
  } catch {
    // Storage blocked: this tab still tracks its own activity
  }
}

// Automatic sign-out after 30 minutes of no activity. Uses timers and a stored time only
// (no React state), so moving the mouse never re-renders the page.
function useIdleLogout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    let lastActive = Date.now()
    let lastSaved = 0
    saveLastActive(lastActive)

    const markActive = () => {
      lastActive = Date.now()
      if (lastActive - lastSaved > SAVE_EVERY_MS) {
        lastSaved = lastActive
        saveLastActive(lastActive)
      }
    }

    const check = async () => {
      const latest = Math.max(lastActive, readLastActive())
      if (Date.now() - latest < IDLE_LIMIT_MS) return
      clearInterval(timer)
      await logout()
      navigate('/login', { replace: true })
      dispatch(signOut())
      toast.info('You were signed out after 30 minutes of inactivity.')
    }

    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, markActive, { passive: true }))
    document.addEventListener('visibilitychange', check)
    const timer = setInterval(check, CHECK_EVERY_MS)

    return () => {
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, markActive))
      document.removeEventListener('visibilitychange', check)
      clearInterval(timer)
    }
  }, [navigate, dispatch])
}

export default useIdleLogout
