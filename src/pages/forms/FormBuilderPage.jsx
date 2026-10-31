import { useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FileSearch, Plus } from 'lucide-react'
import { toast } from 'react-toastify'
import QuestionEditor from '../../components/forms/QuestionEditor'
import HeaderFieldPicker from '../../components/forms/HeaderFieldPicker'
import ImportFormButton from '../../components/forms/ImportFormButton'
import FormPreviewModal from '../../components/forms/FormPreviewModal'
import ExportMenu from '../../components/common/ExportMenu'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Skeleton from '../../components/ui/Skeleton'
import Textarea from '../../components/ui/Textarea'
import useFormBuilder from '../../hooks/useFormBuilder'
import useRequest from '../../hooks/useRequest'
import useKeepDraftOnLeave from '../../hooks/useKeepDraftOnLeave'
import { newQuestion, numberQuestions, validateFormBuilder, variableField } from '../../utils/formBuilderHelpers'
import { FORM_EXPORT_FORMATS, exportForm } from '../../utils/export/exportForm'

const addButton =
  'flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-4 text-sm font-medium text-gray-600 hover:border-brand-400 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50'

// Create Form (/documents/forms/new) and Edit Form (/documents/forms/:id/edit)
function FormBuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  // Opened from "Import" on the Forms page: start from the imported form
  const { state } = useLocation()
  const builder = useFormBuilder(id, state?.imported)
  const { form } = builder
  const [errors, setErrors] = useState({})
  const save = useRequest(builder.save)
  const [previewing, setPreviewing] = useState(null)
  const discard = useRequest(builder.discardChanges)
  const saved = useRef(false)

  // Leaving with unsaved changes keeps them: a new form as a draft, a saved form as unsaved changes
  useKeepDraftOnLeave(
    // `saved`: Save was clicked and the page is closing (the screen has not caught up yet)
    {
      isDirty: () => builder.dirty && !saved.current,
      saveDraft: builder.saveDraft,
      name: form?.title.trim() || 'Untitled form',
    },
    'Forms',
  )

  const handleSave = async () => {
    const newErrors = validateFormBuilder(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return toast.error('Please fix the highlighted fields.')
    if (await save.run()) {
      saved.current = true
      toast.success('Form saved')
      navigate('/documents')
    }
  }

  // Preview and export use what is on screen (saved or not), once it is complete
  const isComplete = () => {
    const newErrors = validateFormBuilder(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length) toast.error('Please fix the highlighted fields first.')
    return !Object.keys(newErrors).length
  }
  const handleExport = (format) => isComplete() && exportForm(form, format)
  // A copy, so typing behind the preview does not rebuild it
  const handlePreview = () => isComplete() && setPreviewing({ ...form })

  // Replaces what is on screen with the imported form
  const handleImported = ({ form: imported, exact }) => {
    builder.replaceForm(imported)
    setErrors({})
    toast.success(exact ? 'Form imported' : 'Form imported. Please check each field before saving.')
  }

  if (builder.loadError) return <Alert>{builder.loadError}</Alert>
  if (!form) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    )
  }

  const numbered = numberQuestions(form.questions)

  // One editor per item; `list` is 'header' or 'questions'
  const editor = (list, item, index, items) => (
    <QuestionEditor
      key={item.id}
      question={item}
      number={item.number}
      isHeader={list === 'header'}
      position={index + 1}
      total={items.length}
      errors={errors[item.id]}
      onChange={(changes) => builder.updateItem(list, item.id, changes)}
      onMove={(offset) => builder.moveItem(list, index, offset)}
      onRemove={() => builder.removeItem(list, item.id)}
    />
  )

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Stays under the navbar while scrolling, so Preview / Export / Cancel / Save are always reachable */}
      <div className="sticky top-16 z-[5] -mx-2 flex flex-wrap items-center gap-3 rounded-b-xl border-b border-gray-100 bg-page/95 px-2 py-3 backdrop-blur">
        <Link to="/documents" className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100" aria-label="Back to forms">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">{id ? 'Edit Form' : 'Create Form'}</h1>
        <div className="ml-auto flex gap-2">
          <ImportFormButton onImported={handleImported} />
          <Button variant="outline" fullWidth={false} onClick={handlePreview}>
            <FileSearch size={16} />
            Preview
          </Button>
          <ExportMenu only={FORM_EXPORT_FORMATS} onExport={handleExport} />
          <Button variant="outline" fullWidth={false} onClick={() => navigate('/documents')}>
            Cancel
          </Button>
          <Button fullWidth={false} loading={save.loading} onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>

      <Alert>{save.error || discard.error}</Alert>
      {builder.isDraft && (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          This form is a draft. Click Save to finish it; drafts can&apos;t be shared yet.
        </p>
      )}
      {builder.hasPendingChanges && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <p className="flex-1">
            These are unsaved changes from last time. The saved version stays live until you click Save.
          </p>
          <Button variant="outline" fullWidth={false} loading={discard.loading} onClick={discard.run}>
            Discard changes
          </Button>
        </div>
      )}
      {previewing && <FormPreviewModal form={previewing} onClose={() => setPreviewing(null)} />}

      <section className="space-y-4 rounded-xl border-t-4 border-brand-600 bg-surface p-5 shadow-sm">
        <Input
          label="Title"
          id="title"
          placeholder="e.g. Student Intake Form"
          value={form.title}
          onChange={(e) => builder.setField('title', e.target.value)}
          error={errors.title}
          maxLength={150}
        />
        <Textarea
          label="Description"
          id="description"
          placeholder="What is this form for?"
          value={form.description}
          onChange={(e) => builder.setField('description', e.target.value)}
          maxLength={1000}
        />
      </section>

      {/* Header: student details printed as a grid at the top (not numbered) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Header</h2>
          <p className="text-sm text-gray-500">
            Student details at the top of the form (Name, Date, Grade & Section...). They are not numbered.
          </p>
        </div>
        <HeaderFieldPicker
          header={form.header}
          onAddVariable={(variable) => builder.addItem('header', variableField(variable))}
          onAddCustom={(label) => builder.addItem('header', newQuestion({ label, width: 'half', required: true }))}
        />
        {form.header.map((field, index, items) => editor('header', field, index, items))}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
          <p className="text-sm text-gray-500">Numbered 1, 2, 3... in the order below.</p>
        </div>
        {numbered.map((question, index, items) => editor('questions', question, index, items))}

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <button
            type="button"
            onClick={() => builder.addItem('questions')}
            disabled={form.questions.length >= 100}
            className={addButton}
          >
            <Plus size={16} />
            Add question
          </button>
          <button
            type="button"
            onClick={() => builder.addItem('questions', newQuestion({ type: 'section' }))}
            disabled={form.questions.length >= 100}
            className={`${addButton} px-6`}
          >
            <Plus size={16} />
            Section heading
          </button>
        </div>
      </section>
    </div>
  )
}

export default FormBuilderPage
