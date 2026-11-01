import { useEffect, useState } from 'react'
import { CalendarCheck } from 'lucide-react'
import Badge from '../ui/Badge'
import Skeleton from '../ui/Skeleton'
import useDataVersion from '../../hooks/useDataVersion'
import { getCaseHistory } from '../../services/caseService'
import { FOLLOW_UP } from '../../utils/caseHelpers'
import { formatDate } from '../../utils/dateHelpers'

const TAGS = ['cases'] // reloads after the case is saved (utils/dataSync)
const DOT = { overdue: 'bg-red-500', today: 'bg-orange-500', scheduled: 'bg-sky-500', accomplished: 'bg-green-500' }

// "2026-11-03" → "Nov 03, 2026"; status keys → their labels; anything else as it is
function showValue(change, value) {
  if (!value) return 'empty'
  if (change.field === 'status') return FOLLOW_UP[value]?.label ?? value
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? formatDate(value) : value
}

const time = (iso) => new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

// Timeline of what was done to a case: created, then each save with the fields that changed.
// Remarks show only "Remarks updated" (they are confidential).
function CaseHistory({ caseId }) {
  const [entries, setEntries] = useState(null)
  const [error, setError] = useState('')
  const synced = useDataVersion(TAGS)

  useEffect(() => {
    let ignore = false
    getCaseHistory(caseId)
      .then((data) => !ignore && setEntries(data))
      .catch(() => !ignore && setError('Could not load the action history.'))
    return () => {
      ignore = true
    }
  }, [caseId, synced])

  return (
    <section className="rounded-xl border border-gray-100 p-4">
      <h3 className="mb-3 border-b border-gray-100 pb-2 text-base font-semibold text-gray-900">Action History</h3>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!entries && !error && <Skeleton className="h-20 rounded-lg" />}
      {entries?.length === 0 && <p className="text-sm text-gray-400">No actions yet.</p>}

      {entries?.length > 0 && (
        <ol className="relative ml-1.5 space-y-5 border-l border-gray-200 pl-5">
          {entries.map((entry) => {
            const status = entry.status && FOLLOW_UP[entry.status]
            return (
              <li key={entry.id} className="relative">
                <span
                  className={`absolute top-1.5 -left-[25px] size-2.5 rounded-full ring-4 ring-surface ${DOT[entry.status] ?? 'bg-gray-400'}`}
                />
                <p className="text-sm font-medium text-gray-900">
                  {entry.action === 'created' ? 'Case created' : 'Case updated'}
                </p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-gray-500">
                  <CalendarCheck size={14} className="shrink-0" />
                  {formatDate(entry.createdAt.slice(0, 10))} · {time(entry.createdAt)}
                  {status && <Badge label={status.label} className={status.className} />}
                </p>
                {entry.changes.length > 0 && (
                  <ul className="mt-1.5 space-y-0.5 text-xs text-gray-600">
                    {entry.changes.map((change) => (
                      <li key={change.field}>
                        <span className="font-medium text-gray-700">{change.label}</span>
                        {change.field === 'remarks' ? (
                          ' updated'
                        ) : (
                          <>
                            : {showValue(change, change.from)} → {showValue(change, change.to)}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}

export default CaseHistory
