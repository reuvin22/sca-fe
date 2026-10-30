import { useSelector } from 'react-redux'
import { isProfileComplete } from '../utils/profileHelpers'

// False for new users until they fill the required profile and school details.
// Developers don't belong to a school, so they skip this step.
function useProfileComplete() {
  const { user, school } = useSelector((state) => state.auth)
  if (user?.accessRole === 'dev') return true
  return Boolean(user) && isProfileComplete(user, school)
}

export default useProfileComplete
