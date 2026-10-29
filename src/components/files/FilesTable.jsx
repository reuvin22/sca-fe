import { Download, Trash2 } from 'lucide-react'
import DataTable from '../ui/DataTable'
import Badge from '../ui/Badge'
import { FILE_COLUMNS, getFileKind } from '../../utils/fileHelpers'

const ICON_BUTTON = 'cursor-pointer rounded-md p-1.5 text-gray-500 hover:bg-gray-100'

// Clicking a row opens the file preview
function FilesTable({ files, loading, onOpen, onDelete }) {
  // Screen-only styling and actions (not exported)
  const renders = {
    name: {
      className: 'min-w-56 max-w-sm',
      render: (file) => <span className="font-medium break-all text-gray-900">{file.name}</span>,
    },
    kind: { render: (file) => <Badge {...getFileKind(file.name)} /> },
  }

  const columns = [
    ...FILE_COLUMNS.map((column) => ({ ...column, ...renders[column.id] })),
    {
      id: 'actions',
      label: 'Actions',
      render: (file) => (
        // Stops the click from also opening the preview
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <a href={file.url} download={file.name} aria-label={`Download ${file.name}`} className={ICON_BUTTON}>
            <Download size={16} />
          </a>
          <button type="button" aria-label={`Delete ${file.name}`} onClick={() => onDelete(file)} className={`${ICON_BUTTON} hover:text-red-600`}>
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return <DataTable columns={columns} rows={files} loading={loading} onRowClick={onOpen} emptyText="No files uploaded yet." />
}

export default FilesTable
