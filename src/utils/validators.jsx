export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export function validatePassword({ password, confirmPassword }) {
  const errors = {}
  if (password.length < 8) errors.password = 'Password must be at least 8 characters.'
  if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.'
  return errors
}

export function validateLogin(form) {
  const errors = {}
  if (!isEmail(form.email)) errors.email = 'Enter a valid email.'
  if (!form.password) errors.password = 'Password is required.'
  return errors
}

export function validateCase(form) {
  const errors = {}
  if (!form.learnerName.trim()) errors.learnerName = 'Name of learner is required.'
  if (!form.intakeDate) errors.intakeDate = 'Intake date is required.'
  if (!form.followUpDate) errors.followUpDate = 'Follow-up date is required.'
  return errors
}

export function validateStudent(form) {
  const errors = {}
  if (!form.studentName.trim()) errors.studentName = 'Student name is required.'
  if (!form.dateEncoded) errors.dateEncoded = 'Date encoded is required.'
  return errors
}

export function validateAppointment(form) {
  const errors = {}
  if (!form.studentName) errors.studentName = 'Student is required.'
  if (!form.date) errors.date = 'Date is required.'
  if (!form.time) errors.time = 'Time is required.'
  return errors
}

// To Do column and card both need a title
export function validateTitle(form) {
  return form.title.trim() ? {} : { title: 'Title is required.' }
}

export function validateSupport(form) {
  const errors = {}
  if (!form.subject.trim()) errors.subject = 'Subject is required.'
  if (!form.description.trim()) errors.description = 'Please describe your request.'
  return errors
}

export function validateProfile(form) {
  const errors = {}
  if (!form.fullName.trim()) errors.fullName = 'Full name is required.'
  if (!isEmail(form.email)) errors.email = 'Enter a valid email.'
  if (!form.name.trim()) errors.name = 'School name is required.'
  return errors
}

export function validateRegister(form) {
  const errors = validatePassword(form)
  if (!form.fullName.trim()) errors.fullName = 'Full name is required.'
  if (!isEmail(form.email)) errors.email = 'Enter a valid email.'
  return errors
}
