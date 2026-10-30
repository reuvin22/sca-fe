import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProfilePhotoUrl } from '../services/authService'
import { setPhotoUrl } from '../store/authSlice'

// Downloads the profile photo when the user has one (and again after it changes),
// and keeps its URL in the store so every Avatar can show it. Used once, in MainLayout.
function useLoadProfilePhoto() {
  const dispatch = useDispatch()
  const photoUpdatedAt = useSelector((state) => state.auth.user?.photoUpdatedAt)

  useEffect(() => {
    if (!photoUpdatedAt) return
    let url = null
    let ignore = false

    getProfilePhotoUrl()
      .then((newUrl) => {
        if (ignore) return URL.revokeObjectURL(newUrl)
        url = newUrl
        dispatch(setPhotoUrl(newUrl))
      })
      .catch(() => {}) // keep showing initials if the photo can't load

    // Photo changed or removed: free the old one
    return () => {
      ignore = true
      dispatch(setPhotoUrl(null))
      if (url) URL.revokeObjectURL(url)
    }
  }, [photoUpdatedAt, dispatch])
}

export default useLoadProfilePhoto
