// Keeps data on screen up to date without a websocket (like RTK Query's tags and refetching):
// - every successful create / update / delete marks its data type ("tag") as changed, e.g. POST /cases →
//   "cases" (+ related views like "reports"), and every list or card showing it reloads quietly
// - the same change reaches other open tabs of this browser (BroadcastChannel)
// - everything reloads when the user comes back to the tab, when the internet reconnects,
//   and every 30 seconds while the page is visible (changes made on another device show up)
// Lists keep their rows on screen while reloading, so nothing flashes.

const POLL_MS = 30000
const MIN_REFRESH_GAP_MS = 5000 // focus + visibility + online can fire together: refresh once

// A change to one type also changes these views
const RELATED = {
  cases: ['reports'],
  appointments: ['reports'],
  students: ['reports'],
  support: ['features'],
  features: ['support'],
}

const versions = new Map() // tag → how many times it changed
const listeners = new Set()
let everything = 0 // bumped by focus / reconnect / polling
let lastRefresh = 0

const notify = () => listeners.forEach((listener) => listener())

function bump(tags) {
  for (const tag of tags) versions.set(tag, (versions.get(tag) ?? 0) + 1)
  notify()
}

const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('sca-data-sync')
if (channel) channel.onmessage = (event) => Array.isArray(event.data) && bump(event.data)

// Marks data types as changed here and in other tabs
export function invalidate(tags) {
  if (!tags.length) return
  bump(tags)
  channel?.postMessage(tags)
}

// "/cases/abc" → ["cases", "reports"]; auth calls are not data
export function tagsForUrl(url = '') {
  const tag = url.split('?')[0].split('/').filter(Boolean)[0]
  if (!tag || tag === 'auth' || tag === 'public') return []
  return [tag, ...(RELATED[tag] ?? [])]
}

function refreshAll() {
  const now = Date.now()
  if (now - lastRefresh < MIN_REFRESH_GAP_MS) return
  lastRefresh = now
  everything += 1
  notify()
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', refreshAll)
  document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && refreshAll())
  setInterval(() => document.visibilityState === 'visible' && refreshAll(), POLL_MS)
}

export function subscribeToDataSync(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Changes whenever any of `tags` changed or everything refreshed (a string, so React can compare it)
export const dataVersion = (tags) => `${everything}|${tags.map((tag) => versions.get(tag) ?? 0).join(',')}`
