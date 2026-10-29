import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ClipboardList,
  Share2,
  FileText,
  Settings,
  GraduationCap,
} from 'lucide-react'
import { toggleSidebar } from '../../store/uiSlice'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/cases', label: 'Cases', icon: Users },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/sessions', label: 'Sessions', icon: ClipboardList },
  { to: '/referrals', label: 'Referrals', icon: Share2 },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function Sidebar() {
  const dispatch = useDispatch()
  const collapsed = useSelector((state) => state.ui.sidebarCollapsed)

  return (
    <>
      {/* Backdrop when the sidebar is open on mobile */}
      {!collapsed && (
        <div
          onClick={() => dispatch(toggleSidebar())}
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r border-gray-100 bg-white transition-all md:sticky md:top-0 md:h-screen ${collapsed ? 'w-16' : 'w-60'}`}
      >
        <div className="flex h-16 items-center gap-3 px-4">
          <GraduationCap className="shrink-0 text-purple-600" size={28} />
          {!collapsed && <span className="text-lg font-semibold text-gray-900">SCA</span>}
        </div>

        <nav className="mt-4 flex-1 space-y-1 px-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'
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
