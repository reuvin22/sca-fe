import FormModal from '../common/FormModal'
import Input from '../ui/Input'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { validateTitle } from '../../utils/validators'

// Add mode when `column` is null, rename/delete mode otherwise.
function ColumnModal({ column, cardCount, onSave, onDelete, onClose }) {
  const { form, errors, setErrors, handleChange } = useForm({ title: column?.title ?? '' })
  const save = useRequest(onSave)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateTitle(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return
    if (await save.run(form.title.trim())) onClose()
  }

  return (
    <FormModal
      title={column ? 'Edit Column' : 'Add Column'}
      onSubmit={handleSubmit}
      onClose={onClose}
      onDelete={column && onDelete}
      deleteMessage={column && `"${column.title}" and its ${cardCount} card(s) will be permanently deleted.`}
      saving={save.loading}
      error={save.error}
    >
      <Input label="Column Name" id="title" value={form.title} onChange={handleChange} error={errors.title} autoFocus />
    </FormModal>
  )
}

export default ColumnModal
