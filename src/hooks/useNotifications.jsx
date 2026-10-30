import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getNotificationData } from '../services/reportService'
import { getNotifications } from '../utils/notificationHelpers'

// Notification list + read state. Reloads on every page change so edits show up.
function useNotifications() {
  const { pathname } = useLocation()
  const [notifications, setNotifications] = useState([])
  const [readIds, setReadIds] = useState([])

  useEffect(() => {
    let ignore = false
    getNotificationData()
      .then((data) => !ignore && setNotifications(getNotifications(data)))
      .catch(() => {}) // keep the last list if loading fails
    return () => {
      ignore = true
    }
  }, [pathname])

  const isRead = (id) => readIds.includes(id)

  return {
    notifications,
    unreadCount: notifications.filter((item) => !isRead(item.id)).length,
    isRead,
    markRead: (id) => setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id])),
    markAllRead: () => setReadIds(notifications.map((item) => item.id)),
  }
}

export default useNotifications
