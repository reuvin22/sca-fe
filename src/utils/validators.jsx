export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export function validatePassword({ password, confirmPassword }) {
  const errors = {}
  if (password.length < 8) errors.password = 'Password must be at least 8 characters.'
  if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.'
  return errors
}

export function validateCase(form) {
  const errors = {}
  if (!form.studentName.trim()) errors.studentName = 'Student name is required.'
  if (!form.date) errors.date = 'Date is required.'
  if (!form.followUpDate) errors.followUpDate = 'Follow-up date is required.'
  return errors
}

export function validateRegister(form) {
  const errors = validatePassword(form)
  if (!form.fullName.trim()) errors.fullName = 'Full name is required.'
  if (!isEmail(form.email)) errors.email = 'Enter a valid email.'
  return errors
}
