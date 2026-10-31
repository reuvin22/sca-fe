import { useEffect, useState } from 'react'
import { ChevronDown, FileText, FileType, Inbox, Link2 } from 'lucide-react'
import Modal from '../ui/Modal'
import Alert from '../ui/Alert'
import Pagination from '../ui/Pagination'
import Skeleton from '../ui/Skeleton'
import { getFormSummary, listFormResponses } from '../../services/formService'
import { formatDate } from '../../utils/dateHelpers'

// "Ana · Cruz" for split parts, "Art, Music" for checkboxes
const answerText = (value) => (Array.isArray(value) ? value.filter(Boolean).join(' · ') : value)

const STATS = [
  { key: 'pdf', label: 'PDF exports', icon: FileText },
  { key: 'word', label: 'Word exports', icon: FileType },
  { key: 'link', label: 'Answers via link', icon: Link2 },
]

// Responses of one form: download counts and the answers sent through its public link
function FormResponsesModal({ formItem, onClose }) {
  const [summary, setSummary] = useState(null)
  const [page, setPage] = useState(1)
  const [result, setResult] = useState(null) // { page, items, pagination }
  const [error, setError] = useState('')
  const [openId, setOpenId] = useState(null) // the response whose answers are shown

  useEffect(() => {
    let ignore = false
    getFormSummary(formItem.id)
      .then((data) => !ignore && setSummary(data))
      .catch((err) => !ignore && setError(err.message))
    return () => {
      ignore = true
    }
  }, [formItem.id])

  // The current answers stay on screen while the next page loads
  useEffect(() => {
    let ignore = false
    listFormResponses(formItem.id, page)
      .then((data) => !ignore && setResult({ page, ...data }))
      .catch((err) => !ignore && setError(err.message))
    return () => {
      ignore = true
    }
  }, [formItem.id, page])

  const counts = summary && { ...summary.exports, link: summary.responseCount }

  return (
    <Modal title={`Responses · ${formItem.title}`} onClose={onClose} className="max-w-3xl">
      <Alert>{error}</Alert>

      <div className="grid grid-cols-3 gap-3">
        {STATS.map(({ key, label, icon: Icon }) => (
          <div key={key} className="rounded-lg bg-page p-3">
            <p className="flex items-center gap-1.5 text-xs text-gray-500">
              <Icon size={14} />
              {label}
            </p>
            {counts ? (
              <p className="text-2xl font-semibold text-gray-900">{counts[key]}</p>
            ) : (
              <Skeleton className="mt-1 h-7 w-10" />
            )}
          </div>
        ))}
      </div>

      <h3 className="mt-6 mb-3 text-sm font-semibold tracking-wide text-gray-700 uppercase">Answers via link</h3>
      {!result && !error && <Skeleton className="h-32 rounded-lg" />}
      {result?.items.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <Inbox size={32} className="text-gray-300" />
          <p className="text-sm font-medium text-gray-700">No answers yet</p>
          <p className="text-xs text-gray-400">Share the form&apos;s answer link; answers will show here.</p>
        </div>
      )}
      <div className={`space-y-2 ${result && result.page !== page ? 'opacity-60' : ''}`}>
        {result?.items.map((response, i) => {
          const open = openId === response.id
          const number = result.pagination.total - (result.page - 1) * result.pagination.limit - i
          const time = new Date(response.submittedAt).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })
          // The first answer (usually the name) tells responses apart in the list
          const first = response.answers[0]
          return (
            <article key={response.id} className="rounded-lg border border-gray-100">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : response.id)}
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-gray-50"
              >
                <span className="shrink-0 text-xs font-semibold text-gray-400">#{number}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">
                  {first ? answerText(first.value) : 'No answers'}
                </span>
                <span className="hidden shrink-0 text-xs text-gray-500 sm:inline">
                  {formatDate(response.submittedAt.slice(0, 10))} {time}
                </span>
                <ChevronDown size={16} className={`shrink-0 text-gray-400 transition ${open ? 'rotate-180' : ''}`} />
              </button>

              {open && (
                <div className="border-t border-gray-100 px-4 py-3">
                  <p className="mb-3 text-xs text-gray-500 sm:hidden">
                    {formatDate(response.submittedAt.slice(0, 10))} {time}
                  </p>
                  <dl className="space-y-2">
                    {response.answers.map((answer) => (
                      <div key={answer.id} className="grid gap-0.5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-3">
                        <dt className="text-sm text-gray-500">{answer.label}</dt>
                        <dd className="text-sm font-medium wrap-break-word whitespace-pre-line text-gray-900">
                          {answerText(answer.value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </article>
          )
        })}
      </div>
      {result && <Pagination pagination={result.pagination} onPageChange={setPage} />}
    </Modal>
  )
}

export default FormResponsesModal
