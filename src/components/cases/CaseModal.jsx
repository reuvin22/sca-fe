import { useState } from 'react'
import Modal from '../ui/Modal'
import ConfirmModal from '../ui/ConfirmModal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Alert from '../ui/Alert'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { toDateString } from '../../utils/caseHelpers'
import { validateCase } from '../../utils/validators'

const emptyCase = { studentName: '', gradeSection: '', concern: '', date: toDateString(), followUpDate: '' }

// Add mode when `caseItem` is null, edit mode otherwise.
function CaseModal({ caseItem, onSave, onDelete, onClose }) {
  const { form, errors, setErrors, handleChange } = useForm(caseItem ?? emptyCase)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const save = useRequest(onSave)
  const remove = useRequest(onDelete)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateCase(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return
    if (await save.run(form)) onClose()
  }

  const handleDelete = async () => {
    if (await remove.run(caseItem.id)) onClose()
  }

  return (
    <>
      <Modal title={caseItem ? caseItem.caseNumber : 'Add Case'} onClose={onClose}>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Alert>{save.error || remove.error}</Alert>
          <Input label="Student name" id="studentName" value={form.studentName} onChange={handleChange} error={errors.studentName} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Grade & Section" id="gradeSection" value={form.gradeSection} onChange={handleChange} />
            <Input label="Concern" id="concern" value={form.concern} onChange={handleChange} />
            <Input label="Date" id="date" type="date" value={form.date} onChange={handleChange} error={errors.date} />
            <Input label="Follow-up date" id="followUpDate" type="date" value={form.followUpDate} onChange={handleChange} error={errors.followUpDate} />
          </div>

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            {caseItem && (
              <Button type="button" variant="danger" fullWidth={false} className="mr-auto" onClick={() => setConfirmOpen(true)}>
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" fullWidth={false} onClick={onClose}>
              Close
            </Button>
            <Button type="submit" fullWidth={false} loading={save.loading}>
              {caseItem ? 'Save' : 'Add'}
            </Button>
          </div>
        </form>
      </Modal>

      {confirmOpen && (
        <ConfirmModal
          title="Delete case?"
          message={`${caseItem.caseNumber} (${caseItem.studentName}) will be permanently deleted.`}
          loading={remove.loading}
          onConfirm={handleDelete}
          onClose={() => setConfirmOpen(false)}
        />
      )}
    </>
  )
}

export default CaseModal
