import DatePicker from '../ui/DatePicker'
import Textarea from '../ui/Textarea'
import Input from '../ui/Input'
import FormField from './FormField'

// Renders a field from config: { id, label, type?: 'date' | 'textarea' | 'number' | 'text', category? }
// 'text' is always free typing, even if a Settings category matches.
function DynamicField({ field, value, onChange, error }) {
  const props = { id: field.id, label: field.label, value, onChange, error }

  if (field.type === 'date') return <DatePicker {...props} />
  if (field.type === 'textarea') {
    return (
      <div className="sm:col-span-2">
        <Textarea {...props} />
      </div>
    )
  }
  if (field.type === 'number') return <Input type="number" min="0" {...props} />
  if (field.type === 'text') return <Input {...props} />
  return <FormField category={field.category} {...props} />
}

export default DynamicField
