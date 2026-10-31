import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PdfEditor from '../../components/pdf/PdfEditor'

// PDF editor page: /documents/pdf/new (new document) and /documents/pdf/:id (a stored one)
function PdfEditorPage() {
  const { id: param } = useParams()
  const id = param === 'new' ? undefined : param
  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link
          to="/documents?tab=pdf"
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
          aria-label="Back to PDF documents"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">PDF Editor</h1>
      </div>
      {/* After the first save the address becomes the document's own, without reloading the editor */}
      <PdfEditor id={id} onSaved={(saved) => navigate(`/documents/pdf/${saved.id}`, { replace: true })} />
    </div>
  )
}

export default PdfEditorPage
