import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getCases } from '../services/caseService'
import { getAppointments } from '../services/appointmentService'
import { getNotifications } from '../utils/notificationHelpers'

// Notification list + read state. Reloads on every page change so edits show up.
function useNotifications() {
  const { pathname } = useLocation()
  const [notifications, setNotifications] = useState([])
  const [readIds, setReadIds] = useState([])

  useEffect(() => {
    let ignore = false
    Promise.all([getCases(), getAppointments()])
      .then(([cases, appointments]) => !ignore && setNotifications(getNotifications(cases, appointments)))
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
