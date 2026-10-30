import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Menu, Mail, LifeBuoy, Lightbulb } from 'lucide-react'
import ProfileMenu from './ProfileMenu'
import ThemeMenu from './ThemeMenu'
import SupportModal from './SupportModal'
import NotificationMenu from './NotificationMenu'
import { toggleSidebar } from '../../store/uiSlice'

const iconButton = 'cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-gray-100'

function Navbar() {
  const dispatch = useDispatch()
  const [supportOpen, setSupportOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-gray-100 bg-surface px-4 sm:px-6">
        <div className="flex items-center gap-1">
          <button onClick={() => dispatch(toggleSidebar())} className={iconButton} aria-label="Toggle sidebar">
            <Menu size={20} />
          </button>
          <ProfileMenu />
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => setSupportOpen(true)} className={`flex items-center gap-1.5 ${iconButton}`} aria-label="Contact Support">
            <LifeBuoy size={20} />
            <span className="hidden text-sm font-medium lg:inline">Contact Support</span>
          </button>
          <NavLink
            to="/feature-requests"
            aria-label="Feature Requests"
            className={({ isActive }) => `flex items-center gap-1.5 ${iconButton} ${isActive ? 'bg-gray-100 text-gray-900' : ''}`}
          >
            <Lightbulb size={20} />
            <span className="hidden text-sm font-medium lg:inline">Feature Requests</span>
          </NavLink>
          <ThemeMenu />
          <NotificationMenu />
          <button className={iconButton} aria-label="Messages">
            <Mail size={20} />
          </button>
        </div>
      </header>
      {/* Outside the header so it isn't limited by the header's z-index */}
      {supportOpen && <SupportModal onClose={() => setSupportOpen(false)} />}
    </>
  )
}

export default Navbar
