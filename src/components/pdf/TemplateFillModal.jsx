import { useState } from 'react'
import { useSelector } from 'react-redux'
import { FileText, FileType } from 'lucide-react'
import Modal from '../ui/Modal'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import DatePicker from '../ui/DatePicker'
import useRequest from '../../hooks/useRequest'
import { formatDate } from '../../utils/dateHelpers'
import { knownValues, templateVariables } from '../../utils/templates/documentTemplates'
import { downloadTemplateDocx } from '../../utils/templates/templateDocx'

// Fills in a template's details, then opens it in the PDF editor or downloads it as Word.
// Dates are picked with the calendar and written out (e.g. Oct 31, 2026). Empty details print as blanks.
function TemplateFillModal({ template, onUse, onClose }) {
  const { user, school } = useSelector((state) => state.auth)
  const variables = templateVariables(template)
  const [values, setValues] = useState(() => {
    const known = knownValues(user, school)
    return Object.fromEntries(variables.map(({ key }) => [key, known[key] ?? '']))
  })
  const set = (key, value) => setValues((prev) => ({ ...prev, [key]: value }))
  // Dates read nicely in the document
  const filled = () =>
    Object.fromEntries(
      variables.map(({ key, type }) => [key, type === 'date' && values[key] ? formatDate(values[key]) : values[key]]),
    )
  const word = useRequest(() => downloadTemplateDocx(template, filled(), template.id))

  return (
    <Modal title={template.name} onClose={onClose} className="max-w-2xl">
      <p className="mb-4 text-sm text-gray-500">
        Fill in the details below. Anything left empty prints as a blank line to write on. You can still change any text
        in the editor.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {variables.map(({ key, label, type }) => (
          <div key={key} className={type === 'textarea' ? 'sm:col-span-2' : ''}>
            {type === 'date' ? (
              <DatePicker
                label={label}
                id={`var-${key}`}
                value={values[key]}
                onChange={(e) => set(key, e.target.value)}
              />
            ) : type === 'textarea' ? (
              <Textarea
                label={label}
                id={`var-${key}`}
                rows={3}
                value={values[key]}
                onChange={(e) => set(key, e.target.value)}
              />
            ) : (
              <Input label={label} id={`var-${key}`} value={values[key]} onChange={(e) => set(key, e.target.value)} />
            )}
          </div>
        ))}
      </div>

      <Alert>{word.error}</Alert>
      <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4">
        <Button variant="outline" fullWidth={false} loading={word.loading} onClick={word.run}>
          {!word.loading && <FileType size={16} />}
          Download Word
        </Button>
        <Button fullWidth={false} onClick={() => onUse(filled())}>
          <FileText size={16} />
          Open in PDF editor
        </Button>
      </div>
    </Modal>
  )
}

export default TemplateFillModal
