import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import FileUpload from '../../components/files/FileUpload'
import FilesTable from '../../components/files/FilesTable'
import FilePreviewModal from '../../components/files/FilePreviewModal'
import ExportMenu from '../../components/common/ExportMenu'
import Alert from '../../components/ui/Alert'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import ConfirmModal from '../../components/ui/ConfirmModal'
import Pagination from '../../components/ui/Pagination'
import usePaginatedList from '../../hooks/usePaginatedList'
import useRequest from '../../hooks/useRequest'
import { downloadFile, fileService, getFileUrl } from '../../services/fileService'
import { FILE_COLUMNS, FILE_KIND_OPTIONS, emptyFileFilters, validateFile } from '../../utils/fileHelpers'
import { exportAllRows } from '../../utils/export/exportAllRows'

function FilesPage() {
  const [filters, setFilters] = useState(emptyFileFilters)
  const list = usePaginatedList(fileService, null, filters)
  const [toDelete, setToDelete] = useState(null)
  const [opened, setOpened] = useState(null)
  const [rejected, setRejected] = useState([])

  // Uploads one at a time so each file appears as it finishes
  const upload = useRequest(async (files) => {
    for (const file of files) await list.saveItem(file)
    toast.success(files.length === 1 ? `${files[0].name} uploaded` : `${files.length} files uploaded`)
  })
  const remove = useRequest(list.removeItem)
  // Id of the file in the preview, to ignore a download that finishes after the preview was closed
  const openedId = useRef(null)

  // Opens the preview right away (it shows a loader), then downloads the file.
  // Files need the login token, so they are downloaded before they can be previewed.
  const handleOpen = async (file) => {
    openedId.current = file.id
    setOpened(file)
    try {
      const url = await getFileUrl(file)
      if (openedId.current !== file.id) return URL.revokeObjectURL(url)
      setOpened({ ...file, url })
    } catch (error) {
      if (openedId.current !== file.id) return
      openedId.current = null
      setOpened(null)
      toast.error(error.message)
    }
  }

  // Uploads only allowed files and lists the ones that were skipped
  const handleUpload = (files) => {
    setRejected(files.map(validateFile).filter(Boolean))
    const allowed = files.filter((file) => !validateFile(file))
    if (allowed.length) upload.run(allowed)
  }

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value })

  const handleDownload = (file) => downloadFile(file).catch((error) => toast.error(error.message))

  const handleClosePreview = () => {
    openedId.current = null
    if (opened.url) URL.revokeObjectURL(opened.url)
    setOpened(null)
  }

  const handleDelete = async () => {
    if (await remove.run(toDelete.id)) {
      toast.success(`${toDelete.name} deleted`)
      setToDelete(null)
    }
  }

  const handleExport = (format) =>
    exportAllRows(fileService, filters, format, { sheetName: 'Files', columns: FILE_COLUMNS, fileName: 'files' })

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
      <Alert>{upload.error && `Some files could not be uploaded. ${upload.error}`}</Alert>
      <Alert>{list.error}</Alert>

      <section className="rounded-xl bg-surface shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 p-4">
          <div className="w-full sm:w-56">
            <Input
              id="search"
              type="search"
              placeholder="Search files"
              aria-label="Search files"
              value={filters.search}
              onChange={handleChange}
            />
          </div>
          <Select
            id="kind"
            aria-label="Filter by type"
            options={FILE_KIND_OPTIONS}
            value={filters.kind}
            onChange={handleChange}
          />
          <div className="ml-auto">
            <ExportMenu onExport={handleExport} />
          </div>
        </div>
        <FilesTable
          files={list.items}
          loading={list.loading}
          onOpen={handleOpen}
          onDownload={handleDownload}
          onDelete={setToDelete}
        />
        <Pagination pagination={list.pagination} onPageChange={list.setPage} />
      </section>

      {opened && <FilePreviewModal file={opened} onClose={handleClosePreview} />}

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
