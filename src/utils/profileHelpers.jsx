export const PERSONAL_FIELDS = [
  { id: 'fullName', label: 'Full Name' },
  { id: 'email', label: 'Email', type: 'email' },
  { id: 'role', label: 'Role' },
  { id: 'phone', label: 'Phone', type: 'tel' },
]

// School Counselor Associate isn't editable: it always shows the user's Full Name
export const SCHOOL_FIELDS = [
  { id: 'name', label: 'School Name' },
  { id: 'schoolId', label: 'School ID' },
  { id: 'region', label: 'DepEd Region' },
  { id: 'division', label: 'Schools Division' },
  { id: 'schoolYear', label: 'School Year' },
  { id: 'reportingMonth', label: 'Reporting Month' },
  { id: 'schoolHead', label: 'School Head' },
  { id: 'privacy', label: 'Privacy Classification' },
]

export const COUNSELOR_FIELD = { id: 'counselorAssociate', label: 'School Counselor Associate' }

// Picks only the given fields from a flat form
export const pickFields = (form, fields) => Object.fromEntries(fields.map(({ id }) => [id, form[id].trim()]))
