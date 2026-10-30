import { isAddressComplete } from './addressHelpers'

// `required` fields must be filled before the user can use the rest of the system
export const PERSONAL_FIELDS = [
  { id: 'fullName', label: 'Full Name', required: true },
  { id: 'email', label: 'Email', type: 'email', required: true },
  { id: 'role', label: 'Role' },
  { id: 'phone', label: 'Mobile Number', type: 'tel', required: true },
]

// School Counselor Associate isn't editable: it always shows the user's Full Name
export const SCHOOL_FIELDS = [
  { id: 'name', label: 'School Name', required: true },
  { id: 'schoolId', label: 'School ID', required: true },
  { id: 'region', label: 'DepEd Region', required: true },
  { id: 'division', label: 'Schools Division', required: true },
  { id: 'schoolYear', label: 'School Year', required: true },
  { id: 'reportingMonth', label: 'Reporting Month', required: true },
  { id: 'schoolHead', label: 'School Head', required: true },
  { id: 'privacy', label: 'Privacy Classification', required: true },
]

export const REQUIRED_PROFILE_FIELDS = [...PERSONAL_FIELDS, ...SCHOOL_FIELDS].filter((field) => field.required)

export const COUNSELOR_FIELD = { id: 'counselorAssociate', label: 'School Counselor Associate' }

// Picks only the given fields from a flat form
export const pickFields = (form, fields) => Object.fromEntries(fields.map(({ id }) => [id, (form[id] ?? '').trim()]))

// True when every required personal and school field and the address have a value (new accounts start incomplete)
export function isProfileComplete(user, school) {
  const values = { ...user, ...school }
  return REQUIRED_PROFILE_FIELDS.every(({ id }) => values[id]?.trim()) && isAddressComplete(user.address)
}
