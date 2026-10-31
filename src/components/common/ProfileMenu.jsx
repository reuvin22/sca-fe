import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, UserRound } from 'lucide-react'
import Dropdown from '../ui/Dropdown'
import Avatar from './Avatar'
import { logout } from '../../services/authService'
import { signOut } from '../../store/authSlice'
import { getShortName } from '../../utils/stringHelpers'

const itemClass =
  'flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50'

function ProfileMenu() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  // Clears the saved token, the Google session and the signed-in user.
  // Leaves the page first so nothing renders without a user.
  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
    dispatch(signOut())
  }

  return (
    <Dropdown
      label="Account menu"
      align="left"
      className="w-48"
      trigger={
        <>
          <Avatar className="size-9 text-sm" />
          <span className="hidden font-semibold text-gray-900 sm:block">{getShortName(user.fullName)}</span>
          <ChevronDown size={16} className="hidden text-gray-400 sm:block" />
        </>
      }
    >
      {(close) => (
        <>
          <button
            type="button"
            onClick={() => {
              close()
              navigate('/profile')
            }}
            className={itemClass}
          >
            <UserRound size={16} className="text-gray-400" />
            Profile
          </button>
          <button type="button" onClick={handleLogout} className={`${itemClass} text-red-600`}>
            <LogOut size={16} />
            Logout
          </button>
        </>
      )}
    </Dropdown>
  )
}

export default ProfileMenu
