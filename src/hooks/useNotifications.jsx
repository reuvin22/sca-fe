import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { subscribeToEvents } from '../api/realtime'
import { markNotificationsRead } from '../services/notificationService'
import { getNotificationData } from '../services/reportService'
import { getNotifications, toUpdateNotification } from '../utils/notificationHelpers'

// Unread notifications for the bell. Read ones are saved on the server (per user) and hidden,
// so they stay gone after a reload. Reloads on every page change so edits show up,
// and receives new system updates in real time (no refresh needed).
function useNotifications() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  // Read ids: from the server, plus ones read here (hidden right away, before the save finishes)
  const [readIds, setReadIds] = useState([])

  // Real time: a developer published an update -> add it to the top and show a toast
  useEffect(
    () =>
      subscribeToEvents((event, data) => {
        if (event !== 'system-update') return
        const item = toUpdateNotification(data)
        setNotifications((prev) => [item, ...prev.filter((notification) => notification.id !== item.id)])
        toast.info(`New system update: ${data.title}`, { onClick: () => navigate(item.to) })
      }),
    [navigate],
  )

  useEffect(() => {
    let ignore = false
    getNotificationData()
      .then((data) => {
        if (ignore) return
        setNotifications(getNotifications(data))
        setReadIds((prev) => [...new Set([...prev, ...(data.readIds ?? [])])])
      })
      .catch(() => {}) // keep the last list if loading fails
    return () => {
      ignore = true
    }
  }, [pathname])

  const isRead = (item) => item.read || readIds.includes(item.id)
  const unread = notifications.filter((item) => !isRead(item))

  // Hides them now and saves them as read (a failed save is ignored: they're still hidden here)
  const markAsRead = (ids) => {
    if (ids.length === 0) return
    setReadIds((prev) => [...new Set([...prev, ...ids])])
    markNotificationsRead(ids).catch(() => {})
  }

  return {
    notifications: unread,
    unreadCount: unread.length,
    markRead: (id) => markAsRead([id]),
    markAllRead: () => markAsRead(unread.map((item) => item.id)),
  }
}

export default useNotifications
