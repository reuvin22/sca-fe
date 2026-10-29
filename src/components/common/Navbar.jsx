import { useDispatch } from 'react-redux'
import { Menu, Search, Bell, Mail, UserRound, ChevronDown } from 'lucide-react'
import { toggleSidebar } from '../../store/uiSlice'

const iconButton = 'cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-gray-100'

function Navbar() {
  const dispatch = useDispatch()

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-gray-100 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={() => dispatch(toggleSidebar())} className={iconButton} aria-label="Toggle sidebar">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-purple-600 text-white">
            <UserRound size={18} />
          </span>
          <span className="hidden font-semibold text-gray-900 sm:block">John Smith</span>
          <ChevronDown size={16} className="hidden text-gray-400 sm:block" />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className={iconButton} aria-label="Search">
          <Search size={20} />
        </button>
        <button className={`relative ${iconButton}`} aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-emerald-500" />
        </button>
        <button className={iconButton} aria-label="Messages">
          <Mail size={20} />
        </button>
      </div>
    </header>
  )
}

export default Navbar
