import FormModal from '../common/FormModal'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import DatePicker from '../ui/DatePicker'
import Select from '../ui/Select'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { PRIORITY_OPTIONS, emptyCard } from '../../utils/todoHelpers'
import { validateTitle } from '../../utils/validators'

// `card` always has a columnId. Add mode when it has no id.
// `columns`: every board column, listed in "Move to" when editing a card.
function CardModal({ card, columns, onSave, onDelete, onClose }) {
  const isEdit = Boolean(card.id)
  const { form, errors, setErrors, handleChange } = useForm({ ...emptyCard, ...card })
  const save = useRequest(onSave)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateTitle(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return
    if (await save.run({ ...form, title: form.title.trim() })) onClose()
  }

  return (
    <FormModal
      title={isEdit ? card.key : 'Create Card'}
      className="max-w-2xl"
      onSubmit={handleSubmit}
      onClose={onClose}
      onDelete={isEdit ? () => onDelete(card.id) : undefined}
      deleteMessage={`"${card.title}" will be permanently deleted.`}
      saving={save.loading}
      error={save.error}
    >
      {isEdit && (
        <Select
          label="Move to"
          id="columnId"
          options={columns.map((column) => ({ value: column.id, label: column.title }))}
          value={form.columnId}
          onChange={handleChange}
        />
      )}
      <Input label="Title" id="title" value={form.title} onChange={handleChange} error={errors.title} autoFocus />
      <Textarea label="Description" id="description" value={form.description} onChange={handleChange} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Priority" id="priority" options={PRIORITY_OPTIONS} value={form.priority} onChange={handleChange} />
        <DatePicker label="Due Date" id="dueDate" value={form.dueDate} onChange={handleChange} />
      </div>
    </FormModal>
  )
}

export default CardModal
