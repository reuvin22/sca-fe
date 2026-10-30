import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FolderOpen,
  ListTodo,
  Settings,
  GraduationCap,
  MessagesSquare,
  Bug,
  Megaphone,
  UsersRound,
} from 'lucide-react'
import useProfileComplete from '../../hooks/useProfileComplete'
import useRole from '../../hooks/useRole'
import { toggleSidebar } from '../../store/uiSlice'

// Every role (sca-1, sca-2, sca-3, dev) sees these for now
const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/cases', label: 'Cases', icon: Users },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/consultation', label: 'Consultation', icon: MessagesSquare },
  { to: '/files', label: 'Files', icon: FolderOpen },
  { to: '/todo', label: 'To Do', icon: ListTodo },
  { to: '/settings', label: 'Settings', icon: Settings },
]

// Developers only
const devLinks = [
  { to: '/dev/reports', label: 'Reports', icon: Bug },
  { to: '/dev/updates', label: 'Updates', icon: Megaphone },
  { to: '/dev/team', label: 'Team', icon: UsersRound },
]

function Sidebar() {
  const dispatch = useDispatch()
  const collapsed = useSelector((state) => state.ui.sidebarCollapsed)
  // Tabs stay hidden until a new user completes their profile
  const profileComplete = useProfileComplete()
  const { isDev } = useRole()

  // On small screens the sidebar covers the page, so close it after picking a page
  const closeOnMobile = () => {
    if (window.matchMedia('(max-width: 767px)').matches) dispatch(toggleSidebar())
  }

  const renderLink = ({ to, label, icon: Icon }) => (
    <NavLink
      key={to}
      to={to}
      title={label}
      onClick={closeOnMobile}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50'
        } ${collapsed ? 'justify-center' : ''}`
      }
    >
      <Icon size={20} className="shrink-0" />
      {!collapsed && label}
    </NavLink>
  )

  return (
    <>
      {/* Backdrop when the sidebar is open on mobile */}
      {!collapsed && (
        <div
          onClick={() => dispatch(toggleSidebar())}
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
        />
      )}

      {/* Small screens: hidden until the burger menu opens it. md and up: icons only when collapsed. */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-gray-100 bg-surface transition-all md:sticky md:top-0 md:h-screen md:translate-x-0 ${collapsed ? '-translate-x-full md:w-16' : 'translate-x-0'}`}
      >
        <div className="flex h-16 items-center gap-3 px-4">
          <GraduationCap className="shrink-0 text-brand-600" size={28} />
          {!collapsed && <span className="text-lg font-semibold text-gray-900">SCA</span>}
        </div>

        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-2 pb-4">
          {!profileComplete && !collapsed && (
            <p className="px-3 text-sm text-gray-500">Complete your profile to unlock the menu.</p>
          )}
          {profileComplete && links.map(renderLink)}

          {profileComplete && isDev && (
            <>
              {collapsed ? (
                <hr className="mx-2 my-3 border-gray-200" />
              ) : (
                <p className="px-3 pt-4 pb-1 text-xs font-semibold tracking-wide text-gray-400 uppercase">Developer</p>
              )}
              {devLinks.map(renderLink)}
            </>
          )}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
