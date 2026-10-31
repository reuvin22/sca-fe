import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FilePlus2, FileText, Pencil, Trash2 } from 'lucide-react'
import Alert from '../ui/Alert'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import ConfirmModal from '../ui/ConfirmModal'
import Input from '../ui/Input'
import Pagination from '../ui/Pagination'
import Skeleton from '../ui/Skeleton'
import usePaginatedList from '../../hooks/usePaginatedList'
import useRequest from '../../hooks/useRequest'
import { documentService } from '../../services/documentService'
import { formatDate } from '../../utils/dateHelpers'

const iconButton = 'cursor-pointer rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800'

// PDF Documents (Document Storage): documents made in the PDF editor, saved ones and drafts together,
// shown as cards like Forms. Separate from Files, which holds the user's own uploads.
function DocumentStorage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({ search: '' })
  const list = usePaginatedList(documentService, 'Document', filters)
  const [toDelete, setToDelete] = useState(null)
  const remove = useRequest(list.removeItem)
  const open = (document) => navigate(`/documents/pdf/${document.id}`)

  const handleDelete = async () => {
    if (await remove.run(toDelete.id)) setToDelete(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          PDFs you made in the editor. Unsaved work is kept here as a draft. Open a document to keep editing.
        </p>
        <Button fullWidth={false} onClick={() => navigate('/documents/pdf/new')}>
          <FilePlus2 size={16} />
          New PDF
        </Button>
      </div>

      <div className="w-full sm:w-72">
        <Input
          id="documentSearch"
          type="search"
          placeholder="Search documents"
          aria-label="Search documents"
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
        />
      </div>

      <Alert>{list.error || remove.error}</Alert>

      {list.loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : list.items.length === 0 ? (
        <p className="rounded-xl bg-surface p-10 text-center text-sm text-gray-400 shadow-sm">
          {filters.search ? 'No documents match your search.' : 'No PDF documents yet. Click "New PDF" to make one.'}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.items.map((document) => (
            <article
              key={document.id}
              className="flex flex-col rounded-xl border border-gray-100 bg-surface p-5 shadow-sm"
            >
              <button
                type="button"
                onClick={() => open(document)}
                className="flex flex-1 cursor-pointer items-start gap-3 text-left"
              >
                <FileText size={28} className="shrink-0 text-brand-600" />
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold wrap-break-word text-gray-900">{document.name}</span>
                    {document.draft && <Badge label="Draft" className="bg-amber-100 text-amber-700" />}
                  </span>
                  <span className="mt-1 block text-xs text-gray-400">
                    {document.pageCount} page{document.pageCount === 1 ? '' : 's'} · Changed{' '}
                    {formatDate(document.updatedAt.slice(0, 10))}
                  </span>
                </span>
              </button>
              <div className="mt-4 flex justify-end gap-1 border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => open(document)}
                  className={iconButton}
                  aria-label={`Edit ${document.name}`}
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setToDelete(document)}
                  className={`${iconButton} hover:bg-red-50 hover:text-red-600`}
                  aria-label={`Delete ${document.name}`}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      <Pagination pagination={list.pagination} onPageChange={list.setPage} />

      {toDelete && (
        <ConfirmModal
          title="Delete document?"
          message={`"${toDelete.name}" and its edits will be permanently deleted.`}
          loading={remove.loading}
          onConfirm={handleDelete}
          onClose={() => setToDelete(null)}
        />
      )}
    </div>
  )
}

export default DocumentStorage
