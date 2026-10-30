import { formatDate } from './dateHelpers'

// Allowed file types by extension. `className` colors the badge.
const FILE_KINDS = [
  { label: 'PDF', extensions: ['pdf'], className: 'bg-red-100 text-red-700' },
  { label: 'Excel', extensions: ['xls', 'xlsx'], className: 'bg-green-100 text-green-700' },
  { label: 'CSV', extensions: ['csv'], className: 'bg-emerald-100 text-emerald-700' },
  { label: 'PowerPoint', extensions: ['ppt', 'pptx'], className: 'bg-orange-100 text-orange-700' },
  { label: 'Image', extensions: ['png', 'jpg', 'jpeg'], className: 'bg-purple-100 text-purple-700' },
]

const OTHER = { label: 'Other', className: 'bg-gray-100 text-gray-600' }

export const getFileKind = (name) => {
  const extension = name.split('.').pop().toLowerCase()
  return FILE_KINDS.find((kind) => kind.extensions.includes(extension)) ?? OTHER
}

export const FILE_KIND_OPTIONS = [
  { value: '', label: 'All types' },
  ...FILE_KINDS.map(({ label }) => ({ value: label, label })),
]

// For the file picker, e.g. ".pdf,.xls,..."
export const ACCEPTED_FILES = FILE_KINDS.flatMap((kind) => kind.extensions.map((ext) => `.${ext}`)).join(',')

export const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25 MB

// Error message for a file that can't be uploaded, or '' when it's fine
export function validateFile(file) {
  if (getFileKind(file.name) === OTHER) return `${file.name}: file type not allowed.`
  if (file.size > MAX_FILE_SIZE) return `${file.name}: larger than 25 MB.`
  return ''
}

// 2048 to "2.0 KB"
export const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Table and export columns (plain text)
export const FILE_COLUMNS = [
  { id: 'name', label: 'File Name', width: 40, value: (file) => file.name },
  { id: 'kind', label: 'Type', width: 14, value: (file) => getFileKind(file.name).label },
  { id: 'size', label: 'Size', width: 12, value: (file) => formatSize(file.size) },
  { id: 'uploadedAt', label: 'Uploaded', width: 16, value: (file) => formatDate(file.uploadedAt) },
]

export const emptyFileFilters = { search: '', kind: '' }
