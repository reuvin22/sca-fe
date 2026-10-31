import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { toast } from 'react-toastify'
import Button from '../ui/Button'
import { importFormFile } from '../../utils/formImport'

// "Import" button: picks a Word (.docx) or PDF file and reads the form from it.
// `onImported({ form, exact })`: `exact` is true for files exported from SCA Forms.
function ImportFormButton({ onImported }) {
  const input = useRef(null)
  const [loading, setLoading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    e.target.value = '' // the same file can be picked again
    if (!file) return
    setLoading(true)
    try {
      onImported(await importFormFile(file))
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <input
        ref={input}
        type="file"
        accept=".docx,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={handleFile}
      />
      <Button variant="outline" fullWidth={false} loading={loading} onClick={() => input.current.click()}>
        {!loading && <Upload size={16} />}
        Import
      </Button>
    </>
  )
}

export default ImportFormButton
