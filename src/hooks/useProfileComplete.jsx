import { useSelector } from 'react-redux'
import { isProfileComplete } from '../utils/profileHelpers'

// False for new users until they fill the required profile and school details
function useProfileComplete() {
  const { user, school } = useSelector((state) => state.auth)
  return Boolean(user) && isProfileComplete(user, school)
}

export default useProfileComplete
