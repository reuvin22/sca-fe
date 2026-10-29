import FormModal from '../common/FormModal'
import DynamicField from '../common/DynamicField'
import StudentSelect from '../common/StudentSelect'
import DatePicker from '../ui/DatePicker'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import {
  APPOINTMENT_DROPDOWNS,
  APPOINTMENT_STATUS_OPTIONS,
  REMINDER_OPTIONS,
  TIME_OPTIONS,
  applyReschedule,
  emptyAppointment,
} from '../../utils/appointmentHelpers'
import { validateAppointment } from '../../utils/validators'

const timeOptions = [{ value: '', label: 'Select time' }, ...TIME_OPTIONS]

// Add mode when `appointment` is null, edit mode otherwise.
function AppointmentModal({ appointment, onSave, onDelete, onClose }) {
  const { form, errors, setErrors, handleChange } = useForm(appointment ?? emptyAppointment)
  const save = useRequest(onSave)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateAppointment(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return
    if (await save.run(applyReschedule(appointment, form))) onClose()
  }

  return (
    <FormModal
      title={appointment ? `${appointment.appointmentId} · ${appointment.studentName}` : 'Add Appointment'}
      className="max-w-2xl"
      onSubmit={handleSubmit}
      onClose={onClose}
      onDelete={appointment && (() => onDelete(appointment.id))}
      deleteMessage={appointment && `${appointment.appointmentId} (${appointment.studentName}) will be permanently deleted.`}
      saving={save.loading}
      error={save.error}
    >
      {appointment?.rescheduledFrom && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">Rescheduled from {appointment.rescheduledFrom}</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <StudentSelect id="studentName" value={form.studentName} onChange={handleChange} error={errors.studentName} />
        <DatePicker label="Date" id="date" value={form.date} onChange={handleChange} error={errors.date} />
        <Select label="Time" id="time" options={timeOptions} value={form.time} onChange={handleChange} error={errors.time} />
        {APPOINTMENT_DROPDOWNS.map((field) => (
          <DynamicField key={field.id} field={field} value={form[field.id]} onChange={handleChange} />
        ))}
        <Select label="Status" id="status" options={APPOINTMENT_STATUS_OPTIONS} value={form.status} onChange={handleChange} />
        <Select label="Reminder" id="reminder" options={REMINDER_OPTIONS} value={form.reminder} onChange={handleChange} />
      </div>
      <Textarea label="Notes" id="notes" value={form.notes} onChange={handleChange} />
    </FormModal>
  )
}

export default AppointmentModal
