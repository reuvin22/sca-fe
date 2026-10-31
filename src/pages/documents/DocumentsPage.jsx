import { useSearchParams } from 'react-router-dom'
import { ClipboardList, FilePenLine } from 'lucide-react'
import FormsPage from '../forms/FormsPage'
import DocumentStorage from '../../components/pdf/DocumentStorage'

const TABS = [
  { value: 'forms', label: 'Forms', icon: ClipboardList },
  { value: 'pdf', label: 'PDF Documents', icon: FilePenLine },
]

// Documents: Forms (build, share, responses) and PDF Documents (made in the PDF editor).
// The tab is kept in the URL (?tab=pdf).
function DocumentsPage() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'pdf' ? 'pdf' : 'forms'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Documents</h1>
        <div className="mt-4 flex gap-1 border-b border-gray-200" role="tablist" aria-label="Documents">
          {TABS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => setParams(value === 'forms' ? {} : { tab: value })}
              className={`-mb-px flex cursor-pointer items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium ${
                tab === value
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'forms' ? <FormsPage /> : <DocumentStorage />}
    </div>
  )
}

export default DocumentsPage
