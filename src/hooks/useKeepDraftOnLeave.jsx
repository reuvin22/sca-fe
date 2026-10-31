import { useEffect, useLayoutEffect, useRef } from 'react'
import { toast } from 'react-toastify'

// Keeps unsaved work when the user leaves an editor:
// - moving to another page in the app: `saveDraft()` runs and a message says where to find it
// - closing or reloading the tab: the browser asks "Leave site?" first (a save can't finish then)
// `state` is { isDirty(), saveDraft(), name }; the latest one is used, and isDirty() is asked when leaving.
function useKeepDraftOnLeave(state, place) {
  const latest = useRef(state)
  const mounted = useRef(false)
  useLayoutEffect(() => {
    latest.current = state
  })

  useEffect(() => {
    mounted.current = true
    const warn = (e) => {
      if (latest.current.isDirty()) e.preventDefault()
    }
    window.addEventListener('beforeunload', warn)
    return () => {
      window.removeEventListener('beforeunload', warn)
      mounted.current = false
      // React (in development) unmounts and mounts again right away: only a real leave saves a draft
      setTimeout(() => {
        const { isDirty, saveDraft, name } = latest.current
        if (mounted.current || !isDirty()) return
        saveDraft()
          .then(() => toast.info(`"${name}" was kept as a draft in ${place}`))
          .catch(() => toast.error('Your unsaved changes could not be kept as a draft.'))
      }, 0)
    }
  }, [place])
}

export default useKeepDraftOnLeave
