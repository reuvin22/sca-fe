// Settings categories are matched to form fields by name (e.g. the "Sex" category fills the Sex field).
export const normalizeName = (text) => text.trim().toLowerCase()

// Fields with these names always use Settings options, even if the category was deleted
// (adding a value then creates the category again). Same names as the backend's default categories.
const SETTINGS_CATEGORY_NAMES = [
  // Names of students already served, so a repeat case or record picks the same student
  'Student Name',
  'Sex',
  'Grade & Section',
  'Nature of Concern',
  'Action / Service Rendered',
  'Referred To / Remarks',
  'Intake Classification',
  'School Year',
  'Relationship',
  'Who Student Lives With',
  'Subjects',
  'Feeling About Going to School',
  'People Student Can Talk To',
  'Help Requested',
  'Prefers to Discuss Privately',
  'Parent/Guardian Signature Received',
  'Reviewed By',
  'Follow-up Needed',
  'Recommended Actions',
  'Assigned Staff',
  'Duration',
  'Appointment Type',
  'Reason / Category',
].map(normalizeName)

export const isDefaultSettingsCategory = (name) => SETTINGS_CATEGORY_NAMES.includes(normalizeName(name))
