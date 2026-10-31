import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import Alert from '../ui/Alert'
import Skeleton from '../ui/Skeleton'
import TextLink from '../ui/TextLink'
import { getMe } from '../../services/authService'
import useProfileComplete from '../../hooks/useProfileComplete'
import { getCategories } from '../../services/categoryService'
import { setProfile } from '../../store/authSlice'
import { setCategories } from '../../store/optionsSlice'
import useDataVersion from '../../hooks/useDataVersion'

const CATEGORY_TAGS = ['categories']

// Protects signed-in pages. Without a token it goes to /login.
// After a page refresh it loads the profile and Settings categories before showing the page.
// New users can only open /profile until the required details are filled.
function RequireAuth({ children }) {
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const { token, user } = useSelector((state) => state.auth)
  const profileComplete = useProfileComplete()
  const [error, setError] = useState('')
  const signedIn = Boolean(token)

  useEffect(() => {
    if (!signedIn) return
    Promise.all([getMe(), getCategories()])
      .then(([profile, categories]) => {
        dispatch(setProfile(profile))
        dispatch(setCategories(categories))
      })
      .catch((err) => setError(err.message))
  }, [signedIn, dispatch])

  // Settings lists changed (e.g. in another tab): reload them so every dropdown has the new values
  const categoriesVersion = useDataVersion(CATEGORY_TAGS)
  const firstVersion = useRef(true) // the first load above already got them
  useEffect(() => {
    if (firstVersion.current) {
      firstVersion.current = false
      return
    }
    if (!signedIn) return
    getCategories()
      .then((categories) => dispatch(setCategories(categories)))
      .catch(() => {}) // keep the current lists
  }, [signedIn, categoriesVersion, dispatch])

  if (!signedIn) return <Navigate to="/login" replace />

  if (error) {
    return (
      <div className="mx-auto mt-20 max-w-sm space-y-3 px-4 text-center">
        <Alert>{error}</Alert>
        <TextLink to="/login">Go to sign in</TextLink>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!profileComplete && pathname !== '/profile') return <Navigate to="/profile" replace />

  return children
}

export default RequireAuth
