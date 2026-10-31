import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CircleCheck, PenLine } from 'lucide-react'
import UpdateEditorModal from '../../components/dev/UpdateEditorModal'
import Alert from '../../components/ui/Alert'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Pagination from '../../components/ui/Pagination'
import Skeleton from '../../components/ui/Skeleton'
import useFetch from '../../hooks/useFetch'
import { getDoneTasks } from '../../services/updateService'
import { formatDate } from '../../utils/dateHelpers'
import { REPORT_TYPE } from '../../utils/reportBoardHelpers'

const UPDATE_TAGS = ['support', 'updates'] // reload when tasks or updates change (utils/dataSync)

const PAGE_SIZE = 15

// Developers: every Done task. Write an update for each one; publishing notifies all users.
function DevUpdatesPage() {
  const { data, loading, error, reload } = useFetch(getDoneTasks, UPDATE_TAGS)
  const [writing, setWriting] = useState(null)
  const [page, setPage] = useState(1)
  const tasks = data ?? []
  const totalPages = Math.max(1, Math.ceil(tasks.length / PAGE_SIZE))
  const visible = tasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handlePublished = () => {
    toast.success('Update published. Everyone has been notified.')
    setWriting(null)
    reload()
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Updates</h1>
        <p className="text-sm text-gray-500">Done tasks. Write an update to tell everyone what changed.</p>
      </div>

      <Alert>{error}</Alert>

      <section className="rounded-xl bg-surface shadow-sm">
        {loading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        )}
        {!loading && tasks.length === 0 && (
          <p className="p-8 text-center text-sm text-gray-400">
            No done tasks yet. Move reports to Done on the Reports board.
          </p>
        )}
        <ul className="divide-y divide-gray-100">
          {visible.map((task) => (
            <li key={task.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge {...REPORT_TYPE[task.type]} />
                  <p className="font-medium wrap-break-word text-gray-900">{task.subject}</p>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Done {formatDate(task.updatedAt.slice(0, 10))}
                  {task.assignee && ` · ${task.assignee.name}`} · reported by {task.reporter.name}
                </p>
              </div>
              {task.updateId ? (
                <Link
                  to={`/updates/${task.updateId}`}
                  className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-green-600 hover:underline"
                >
                  <CircleCheck size={16} />
                  Implemented · view update
                </Link>
              ) : (
                <Button fullWidth={false} onClick={() => setWriting(task)}>
                  <PenLine size={16} />
                  Write update
                </Button>
              )}
            </li>
          ))}
        </ul>
        {tasks.length > 0 && (
          <Pagination pagination={{ page, limit: PAGE_SIZE, total: tasks.length, totalPages }} onPageChange={setPage} />
        )}
      </section>

      {writing && <UpdateEditorModal task={writing} onPublished={handlePublished} onClose={() => setWriting(null)} />}
    </div>
  )
}

export default DevUpdatesPage
