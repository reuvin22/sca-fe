import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import Button from '../ui/Button'
import { ACCEPTED_FILES } from '../../utils/fileHelpers'

// Drop zone + Browse button. Calls `onUpload` with a list of Files.
function FileUpload({ onUpload, uploading }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (!uploading && e.dataTransfer.files.length) onUpload([...e.dataTransfer.files])
  }

  const handleSelect = (e) => {
    if (e.target.files.length) onUpload([...e.target.files])
    e.target.value = '' // lets the same file be picked again
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition sm:p-8 ${dragOver ? 'border-brand-400 bg-brand-50' : 'border-gray-300 bg-surface'}`}
    >
      <Upload size={28} className="text-gray-400" />
      <div>
        <p className="text-sm font-medium text-gray-700">Drag and drop files here</p>
        <p className="text-xs text-gray-400">PDF, Excel, CSV, PowerPoint, PNG or JPG · up to 25 MB each</p>
      </div>
      <input ref={inputRef} type="file" accept={ACCEPTED_FILES} multiple hidden onChange={handleSelect} />
      <Button fullWidth={false} loading={uploading} onClick={() => inputRef.current.click()}>
        {uploading ? 'Uploading...' : 'Browse Files'}
      </Button>
    </div>
  )
}

export default FileUpload
