import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getNotificationData } from '../services/reportService'
import { markUpdateRead } from '../services/updateService'
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

  // System updates remember "read" on the server; the others only until the page reloads
  const isRead = (id) => readIds.includes(id) || notifications.some((item) => item.id === id && item.read)

  const markRead = (id) => {
    const item = notifications.find((notification) => notification.id === id)
    if (item?.updateId && !item.read) markUpdateRead(item.updateId).catch(() => {})
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  return {
    notifications,
    unreadCount: notifications.filter((item) => !isRead(item.id)).length,
    isRead,
    markRead,
    markAllRead: () => notifications.forEach((item) => markRead(item.id)),
  }
}

export default useNotifications
