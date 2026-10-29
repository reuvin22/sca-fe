import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import Dropdown from '../ui/Dropdown'
import useNotifications from '../../hooks/useNotifications'

// Bell with unread count. Clicking a notification marks it read and opens its page.
function NotificationMenu() {
  const navigate = useNavigate()
  const { notifications, unreadCount, isRead, markRead, markAllRead } = useNotifications()

  const trigger = (
    <span className="relative">
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
          {unreadCount}
        </span>
      )}
    </span>
  )

  return (
    <Dropdown label="Notifications" trigger={trigger} className="w-[min(20rem,calc(100vw-2rem))]">
      {(close) => (
        <>
          <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
            <p className="text-sm font-semibold text-gray-900">Notifications</p>
            {unreadCount > 0 && (
              <button type="button" onClick={markAllRead} className="cursor-pointer text-xs font-medium text-brand-600 hover:underline">
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-gray-400">You're all caught up.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {notifications.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      markRead(item.id)
                      close()
                      navigate(item.to)
                    }}
                    className={`flex w-full cursor-pointer gap-3 px-3 py-2.5 text-left hover:bg-gray-50 ${isRead(item.id) ? 'opacity-60' : ''}`}
                  >
                    <span className={`mt-1.5 size-2 shrink-0 rounded-full ${isRead(item.id) ? 'bg-gray-300' : item.className}`} />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-gray-900">{item.title}</span>
                      <span className="block truncate text-xs text-gray-500">{item.message}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Dropdown>
  )
}

export default NotificationMenu
