import { useState } from 'react'
import { CircleCheck } from 'lucide-react'
import FormModal from './FormModal'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { sendSupportRequest } from '../../services/supportService'
import { validateSupport } from '../../utils/validators'

const TYPE_OPTIONS = [
  { value: 'bug', label: 'Report a Bug' },
  { value: 'feature', label: 'Request a Feature' },
]

// Only asked for bug reports
const SEVERITY_OPTIONS = [
  { value: 'low', label: 'Low – minor issue, has a workaround' },
  { value: 'medium', label: 'Medium – some features are not working' },
  { value: 'high', label: 'High – a main feature is blocked' },
  { value: 'critical', label: 'Critical – system unusable or data at risk' },
]

const HINTS = {
  bug: 'What happened, what you expected, and the steps to make it happen again.',
  feature: 'What you would like added and how it would help your work.',
}

// Bug report / feature request form. Shows a thank-you message after sending.
function SupportModal({ onClose }) {
  const { form, errors, setErrors, handleChange } = useForm({ type: 'bug', severity: 'medium', subject: '', description: '' })
  const send = useRequest(sendSupportRequest)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateSupport(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return
    const request = { type: form.type, subject: form.subject.trim(), description: form.description.trim() }
    if (form.type === 'bug') request.severity = form.severity
    if (await send.run(request)) setSent(true)
  }

  if (sent) {
    return (
      <Modal title="Contact Support" onClose={onClose} className="max-w-md">
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <CircleCheck size={40} className="text-green-600" />
          <p className="font-semibold text-gray-900">Thank you!</p>
          <p className="text-sm text-gray-500">Your request was sent to the support team.</p>
        </div>
        <Button onClick={onClose}>Close</Button>
      </Modal>
    )
  }

  return (
    <FormModal
      title="Contact Support"
      className="max-w-lg"
      submitLabel="Send"
      onSubmit={handleSubmit}
      onClose={onClose}
      saving={send.loading}
      error={send.error}
    >
      <Select label="Type" id="type" options={TYPE_OPTIONS} value={form.type} onChange={handleChange} />
      {form.type === 'bug' && (
        <Select label="Severity" id="severity" options={SEVERITY_OPTIONS} value={form.severity} onChange={handleChange} />
      )}
      <Input label="Subject" id="subject" value={form.subject} onChange={handleChange} error={errors.subject} />
      <Textarea
        label="Description"
        id="description"
        rows={5}
        placeholder={HINTS[form.type]}
        value={form.description}
        onChange={handleChange}
        error={errors.description}
      />
    </FormModal>
  )
}

export default SupportModal
