import { useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react'

const SHOW_AFTER = 4 // seconds: quick answers never show it

// "Still connecting… 12 s" under a button while a slow request (e.g. signing in while the server wakes up)
// is still running, so the user knows to wait instead of trying again.
function WaitingNotice({ active }) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!active) return
    const started = Date.now()
    const timer = setInterval(() => setSeconds(Math.floor((Date.now() - started) / 1000)), 1000)
    return () => {
      clearInterval(timer)
      setSeconds(0)
    }
  }, [active])

  if (!active || seconds < SHOW_AFTER) return null
  return (
    <p role="status" className="flex items-start gap-2 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700">
      <LoaderCircle size={14} className="mt-0.5 shrink-0 animate-spin" />
      <span>
        Still connecting… <span className="font-semibold tabular-nums">{seconds}s</span>. The server may be starting up,
        which can take up to a minute. Please keep this page open.
      </span>
    </p>
  )
}

export default WaitingNotice
