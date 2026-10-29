import { useState } from 'react'
import { toast } from 'react-toastify'
import FileUpload from '../../components/files/FileUpload'
import FilesTable from '../../components/files/FilesTable'
import FilePreviewModal from '../../components/files/FilePreviewModal'
import ExportMenu from '../../components/common/ExportMenu'
import Alert from '../../components/ui/Alert'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import ConfirmModal from '../../components/ui/ConfirmModal'
import useCrud from '../../hooks/useCrud'
import useRequest from '../../hooks/useRequest'
import { fileService } from '../../services/fileService'
import { FILE_COLUMNS, FILE_KIND_OPTIONS, emptyFileFilters, filterFiles, validateFile } from '../../utils/fileHelpers'
import { exportTable } from '../../utils/export/exportTable'

function FilesPage() {
  const { items: files, loading, saveItem, removeItem } = useCrud(fileService)
  const [filters, setFilters] = useState(emptyFileFilters)
  const [toDelete, setToDelete] = useState(null)
  const [opened, setOpened] = useState(null)
  const [rejected, setRejected] = useState([])
  const visibleFiles = filterFiles(files, filters)

  // Uploads one at a time so each file appears as it finishes
  const upload = useRequest(async (list) => {
    for (const file of list) await saveItem(file)
    toast.success(list.length === 1 ? `${list[0].name} uploaded` : `${list.length} files uploaded`)
  })
  const remove = useRequest(removeItem)

  // Uploads only allowed files and lists the ones that were skipped
  const handleUpload = (list) => {
    setRejected(list.map(validateFile).filter(Boolean))
    const allowed = list.filter((file) => !validateFile(file))
    if (allowed.length) upload.run(allowed)
  }

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value })

  const handleDelete = async () => {
    if (await remove.run(toDelete.id)) {
      toast.success(`${toDelete.name} deleted`)
      setToDelete(null)
    }
  }

  const handleExport = (format) =>
    exportTable(format, { sheetName: 'Files', columns: FILE_COLUMNS, rows: visibleFiles, fileName: 'files' })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Files</h1>
        <p className="text-sm text-gray-500">Upload and keep your documents in one place.</p>
      </div>

      <FileUpload onUpload={handleUpload} uploading={upload.loading} />
      {rejected.length > 0 && (
        <Alert>
          Not uploaded:
          {rejected.map((message) => (
            <span key={message} className="block">
              {message}
            </span>
          ))}
        </Alert>
      )}
      <Alert>{upload.error && 'Some files could not be uploaded. Please try again.'}</Alert>

      <section className="rounded-xl bg-surface shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 p-4">
          <div className="w-full sm:w-56">
            <Input id="search" type="search" placeholder="Search files" aria-label="Search files" value={filters.search} onChange={handleChange} />
          </div>
          <Select id="kind" aria-label="Filter by type" options={FILE_KIND_OPTIONS} value={filters.kind} onChange={handleChange} />
          <div className="ml-auto">
            <ExportMenu onExport={handleExport} />
          </div>
        </div>
        <FilesTable files={visibleFiles} loading={loading} onOpen={setOpened} onDelete={setToDelete} />
      </section>

      {opened && <FilePreviewModal file={opened} onClose={() => setOpened(null)} />}

      {toDelete && (
        <ConfirmModal
          message={`${toDelete.name} will be permanently deleted.`}
          loading={remove.loading}
          onConfirm={handleDelete}
          onClose={() => setToDelete(null)}
        />
      )}
    </div>
  )
}

export default FilesPage
