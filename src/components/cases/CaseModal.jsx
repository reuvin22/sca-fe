import FormModal from '../common/FormModal'
import DatePicker from '../ui/DatePicker'
import Textarea from '../ui/Textarea'
import Select from '../ui/Select'
import DynamicField from '../common/DynamicField'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { toDateString } from '../../utils/dateHelpers'
import { CASE_DROPDOWNS, STATUS_OPTIONS, getCaseStatus } from '../../utils/caseHelpers'
import { validateCase } from '../../utils/validators'

const emptyCase = {
  intakeDate: toDateString(),
  learnerName: '',
  gradeSection: '',
  concern: '',
  action: '',
  referredTo: '',
  classification: '',
  followUpDate: '',
  remarks: '',
  status: '',
}

const statusOptions = [{ value: '', label: 'Select status' }, ...STATUS_OPTIONS]

// Add mode when `caseItem` is null, edit mode otherwise.
function CaseModal({ caseItem, onSave, onDelete, onClose }) {
  const { form, errors, setErrors, handleChange } = useForm(caseItem ?? emptyCase)
  const save = useRequest(onSave)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateCase(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return
    if (await save.run(form)) onClose()
  }

  return (
    <FormModal
      title={caseItem ? caseItem.caseNumber : 'Add Case'}
      className="max-w-2xl"
      onSubmit={handleSubmit}
      onClose={onClose}
      onDelete={caseItem && (() => onDelete(caseItem.id))}
      deleteMessage={caseItem && `${caseItem.caseNumber} (${caseItem.learnerName}) will be permanently deleted.`}
      saving={save.loading}
      error={save.error}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <DatePicker label="Intake Date" id="intakeDate" value={form.intakeDate} onChange={handleChange} error={errors.intakeDate} />
        {CASE_DROPDOWNS.map((field) => (
          <DynamicField key={field.id} field={field} value={form[field.id]} onChange={handleChange} error={errors[field.id]} />
        ))}
        <DatePicker label="Follow-up Date" id="followUpDate" value={form.followUpDate} onChange={handleChange} error={errors.followUpDate} />
        <Select label="Status" id="status" options={statusOptions} value={getCaseStatus(form)} onChange={handleChange} />
      </div>
      <Textarea label="Remarks" id="remarks" value={form.remarks} onChange={handleChange} />
    </FormModal>
  )
}

export default CaseModal
