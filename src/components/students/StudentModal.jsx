import FormModal from '../common/FormModal'
import DynamicField from '../common/DynamicField'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { toDateString } from '../../utils/dateHelpers'
import { STUDENT_SECTIONS, emptyStudent } from '../../utils/studentHelpers'
import { validateStudent } from '../../utils/validators'

// Add mode when `student` is null, edit mode otherwise.
function StudentModal({ student, onSave, onDelete, onClose }) {
  const { form, errors, setErrors, handleChange } = useForm(student ?? { ...emptyStudent, dateEncoded: toDateString() })
  const save = useRequest(onSave)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateStudent(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return
    if (await save.run(form)) onClose()
  }

  return (
    <FormModal
      title={student ? `${student.recordId} · ${student.studentName}` : 'Add Student'}
      className="max-w-3xl"
      onSubmit={handleSubmit}
      onClose={onClose}
      onDelete={student && (() => onDelete(student.id))}
      deleteMessage={student && `${student.recordId} (${student.studentName}) will be permanently deleted.`}
      saving={save.loading}
      error={save.error}
    >
      {STUDENT_SECTIONS.map((section) => (
        <fieldset key={section.title} className="space-y-3 border-t border-gray-100 pt-4 first:border-0 first:pt-0">
          <legend className="text-sm font-semibold text-gray-900">{section.title}</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            {section.fields.map((field) => (
              <DynamicField key={field.id} field={field} value={form[field.id]} onChange={handleChange} error={errors[field.id]} />
            ))}
          </div>
        </fieldset>
      ))}
    </FormModal>
  )
}

export default StudentModal
