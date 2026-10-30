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
} from 'lucide-react'
import useProfileComplete from '../../hooks/useProfileComplete'
import { toggleSidebar } from '../../store/uiSlice'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/cases', label: 'Cases', icon: Users },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/files', label: 'Files', icon: FolderOpen },
  { to: '/todo', label: 'To Do', icon: ListTodo },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function Sidebar() {
  const dispatch = useDispatch()
  const collapsed = useSelector((state) => state.ui.sidebarCollapsed)
  // Tabs stay hidden until a new user completes their profile
  const profileComplete = useProfileComplete()

  // On small screens the sidebar covers the page, so close it after picking a page
  const closeOnMobile = () => {
    if (window.matchMedia('(max-width: 767px)').matches) dispatch(toggleSidebar())
  }

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

        <nav className="mt-4 flex-1 space-y-1 px-2">
          {!profileComplete && !collapsed && (
            <p className="px-3 text-sm text-gray-500">Complete your profile to unlock the menu.</p>
          )}
          {profileComplete && links.map(({ to, label, icon: Icon }) => (
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
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
