import { getToken } from '../utils/authStorage'

const STREAM_URL = `${import.meta.env.VITE_API_BASE_URL}/notifications/stream`
const MAX_RETRY_MS = 30000

// One Server-Sent Events message ("event: name\ndata: {...}") -> { event, data }, or null
function parseMessage(raw) {
  let event = 'message'
  let data = ''
  raw.split('\n').forEach((line) => {
    if (line.startsWith('event:')) event = line.slice(6).trim()
    else if (line.startsWith('data:')) data += line.slice(5).trim()
  })
  if (!data) return null // heartbeats and settings have no data
  try {
    return { event, data: JSON.parse(data) }
  } catch {
    return null
  }
}

// Real-time events from the backend. Calls `onEvent(event, data)` as they arrive.
// Uses fetch (not EventSource) so the login token goes in a header, not in the URL.
// Reconnects by itself (1 s, 2 s, 4 s … up to 30 s). Returns a function that stops listening.
export function subscribeToEvents(onEvent) {
  let stopped = false
  let controller = null
  let retryMs = 1000

  async function connect() {
    controller = new AbortController()
    try {
      const response = await fetch(STREAM_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
        signal: controller.signal,
      })
      if (response.status === 401) return // signed out: don't retry
      if (!response.ok || !response.body) throw new Error('Stream unavailable')
      retryMs = 1000

      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
      let buffer = ''
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += value
        let end
        while ((end = buffer.indexOf('\n\n')) !== -1) {
          const message = parseMessage(buffer.slice(0, end))
          buffer = buffer.slice(end + 2)
          if (message) onEvent(message.event, message.data)
        }
      }
    } catch {
      if (stopped) return
    }
    // Connection ended (server restart, network change): try again
    if (!stopped) {
      setTimeout(connect, retryMs)
      retryMs = Math.min(retryMs * 2, MAX_RETRY_MS)
    }
  }

  connect()
  return () => {
    stopped = true
    controller?.abort()
  }
}
