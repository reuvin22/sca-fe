import { useSelector } from 'react-redux'
import { getInitials } from '../../utils/stringHelpers'

// The signed-in user's profile photo, or their initials when there is none.
// `className` sets the size and text size, e.g. "size-9 text-sm".
function Avatar({ className = 'size-9 text-sm' }) {
  const fullName = useSelector((state) => state.auth.user?.fullName)
  const photoUrl = useSelector((state) => state.auth.photoUrl)

  if (photoUrl) {
    return <img src={photoUrl} alt={fullName} className={`shrink-0 rounded-full object-cover ${className}`} />
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand-600 font-semibold text-white ${className}`}
      aria-hidden="true"
    >
      {getInitials(fullName)}
    </span>
  )
}

export default Avatar
