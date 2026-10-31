import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Plus } from 'lucide-react'
import FormCard from '../../components/forms/FormCard'
import ImportFormButton from '../../components/forms/ImportFormButton'
import FormResponsesModal from '../../components/forms/FormResponsesModal'
import FormPreviewModal from '../../components/forms/FormPreviewModal'
import ShareLinkModal from '../../components/forms/ShareLinkModal'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import ConfirmModal from '../../components/ui/ConfirmModal'
import Input from '../../components/ui/Input'
import Pagination from '../../components/ui/Pagination'
import Skeleton from '../../components/ui/Skeleton'
import usePaginatedList from '../../hooks/usePaginatedList'
import useRequest from '../../hooks/useRequest'
import { formService } from '../../services/formService'

function FormsPage() {
  const [filters, setFilters] = useState({ search: '' })
  const list = usePaginatedList(formService, 'Form', filters)
  const navigate = useNavigate()
  const [viewing, setViewing] = useState(null)
  const [previewing, setPreviewing] = useState(null)
  const [sharing, setSharing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const remove = useRequest(list.removeItem)

  // Opens Create Form already filled with the imported form (saved only when the user clicks Save)
  const handleImported = ({ form, exact }) => {
    if (!exact) toast.info('Form imported. Please check each field before saving.')
    navigate('/forms/new', { state: { imported: form } })
  }

  const handleDelete = async () => {
    if (await remove.run(toDelete.id)) setToDelete(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Forms</h1>
          <p className="text-sm text-gray-500">Create forms and see their responses.</p>
        </div>
        <div className="flex gap-2">
          <ImportFormButton onImported={handleImported} />
          <Button fullWidth={false} onClick={() => navigate('/forms/new')}>
            <Plus size={16} />
            Add Form
          </Button>
        </div>
      </div>

      <div className="w-full sm:w-72">
        <Input
          id="search"
          type="search"
          placeholder="Search forms"
          aria-label="Search forms"
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
        />
      </div>

      <Alert>{list.error || remove.error}</Alert>

      {list.loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : list.items.length === 0 ? (
        <p className="rounded-xl bg-surface p-10 text-center text-sm text-gray-400 shadow-sm">
          {filters.search ? 'No forms match your search.' : 'No forms yet. Click "Add Form" to create one.'}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.items.map((form) => (
            <FormCard
              key={form.id}
              form={form}
              onPreview={setPreviewing}
              onShare={setSharing}
              onEdit={(form) => navigate(`/forms/${form.id}/edit`)}
              onViewResponses={setViewing}
              onDelete={setToDelete}
            />
          ))}
        </div>
      )}
      <Pagination pagination={list.pagination} onPageChange={list.setPage} />

      {sharing && <ShareLinkModal formItem={sharing} onClose={() => setSharing(null)} />}
      {previewing && <FormPreviewModal form={previewing} onClose={() => setPreviewing(null)} />}
      {viewing && <FormResponsesModal formItem={viewing} onClose={() => setViewing(null)} />}
      {toDelete && (
        <ConfirmModal
          title="Delete form?"
          message={`"${toDelete.title}" will be permanently deleted.`}
          loading={remove.loading}
          onConfirm={handleDelete}
          onClose={() => setToDelete(null)}
        />
      )}
    </div>
  )
}

export default FormsPage
