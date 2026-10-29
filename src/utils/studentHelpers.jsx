import { formatDate } from './dateHelpers'

// Form sections, in the same order as the table headers. Fields without a `type` are
// dropdowns when a Settings category matches `category` (or the label), otherwise free typing.
export const STUDENT_SECTIONS = [
  {
    title: 'Student Information',
    fields: [
      { id: 'dateEncoded', label: 'Date Encoded', type: 'date' },
      { id: 'studentName', label: 'Student Name' },
      { id: 'preferredName', label: 'Preferred Name' },
      { id: 'age', label: 'Age', type: 'number' },
      { id: 'sex', label: 'Sex' },
      { id: 'birthday', label: 'Birthday', type: 'date' },
      { id: 'gradeSection', label: 'Grade & Section' },
      { id: 'schoolYear', label: 'School Year' },
      { id: 'lrn', label: 'LRN (if applicable)' },
      { id: 'address', label: 'Address', type: 'textarea' },
      { id: 'contactNumber', label: 'Contact Number (if applicable)' },
    ],
  },
  {
    title: 'Family',
    fields: [
      { id: 'guardian1Name', label: 'Parent/Guardian 1 Name' },
      { id: 'guardian1Relationship', label: 'Parent/Guardian 1 Relationship', category: 'Relationship' },
      { id: 'guardian1Contact', label: 'Parent/Guardian 1 Contact No.' },
      { id: 'guardian2Name', label: 'Parent/Guardian 2 Name' },
      { id: 'guardian2Relationship', label: 'Parent/Guardian 2 Relationship', category: 'Relationship' },
      { id: 'guardian2Contact', label: 'Parent/Guardian 2 Contact No.' },
      { id: 'livesWith', label: 'Who Student Lives With' },
      { id: 'otherLivingArrangement', label: 'Other Living Arrangement' },
    ],
  },
  {
    title: 'Emergency Contact',
    fields: [
      { id: 'emergencyPerson', label: 'Emergency Contact Person' },
      { id: 'emergencyRelationship', label: 'Emergency Contact Relationship', category: 'Relationship' },
      { id: 'emergencyNumber', label: 'Emergency Contact Number' },
    ],
  },
  {
    title: 'School & Interests',
    fields: [
      { id: 'subjectsEnjoyed', label: 'Subjects Enjoyed', category: 'Subjects' },
      { id: 'subjectsDifficult', label: 'Subjects Found Difficult', category: 'Subjects' },
      { id: 'hobbies', label: 'Hobbies / Favorite Activities' },
      { id: 'talents', label: 'Talents / Strengths' },
      { id: 'feelingAboutSchool', label: 'Feeling About Going to School' },
      { id: 'helpsLearn', label: 'What Helps Student Learn', type: 'textarea' },
      { id: 'schoolDifficult', label: 'What Makes School Difficult', type: 'textarea' },
      { id: 'peopleToTalkTo', label: 'People Student Can Talk To' },
      { id: 'helpRequested', label: 'Help Requested' },
      { id: 'otherHelpRequested', label: 'Other Help Requested' },
      { id: 'prefersPrivate', label: 'Prefers to Discuss Privately' },
      { id: 'career', label: 'Career / Aspiration' },
      { id: 'wantsSchoolToKnow', label: 'What Student Wants School to Know', type: 'textarea' },
    ],
  },
  {
    title: 'Parent / Guardian Input',
    fields: [
      { id: 'parentConcerns', label: 'Parent/Guardian Input / Concerns', type: 'textarea' },
      { id: 'parentInputName', label: 'Parent/Guardian Name for Input' },
      { id: 'signatureReceived', label: 'Parent/Guardian Signature Received' },
      { id: 'parentInputDate', label: 'Parent Input Date', type: 'date' },
    ],
  },
  {
    title: 'Guidance Review',
    fields: [
      { id: 'dateReviewed', label: 'Date Reviewed by Guidance', type: 'date' },
      { id: 'reviewedBy', label: 'Reviewed By' },
      { id: 'followUpNeeded', label: 'Follow-up Needed' },
      { id: 'recommendedActions', label: 'Recommended Actions' },
      { id: 'otherRecommendedAction', label: 'Other Recommended Action' },
      { id: 'followUpDate', label: 'Follow-up Date', type: 'date' },
      { id: 'guidanceRemarks', label: 'Guidance Remarks (factual only)', type: 'textarea' },
    ],
  },
]

export const STUDENT_FIELDS = STUDENT_SECTIONS.flatMap((section) => section.fields)

// Table and export columns (plain text, dates formatted)
export const STUDENT_COLUMNS = [
  { id: 'recordId', label: 'Record ID', width: 12, value: (item) => item.recordId },
  ...STUDENT_FIELDS.map((field) => ({
    id: field.id,
    label: field.label,
    type: field.type,
    width: field.type === 'textarea' ? 40 : undefined,
    value: (item) => (field.type === 'date' ? item[field.id] && formatDate(item[field.id]) : item[field.id]),
  })),
]

// Blank form with every field set to ''
export const emptyStudent = Object.fromEntries(STUDENT_FIELDS.map((field) => [field.id, '']))

// Dropdown filters on the Students page. Options come from Settings.
const FILTER_IDS = ['sex', 'gradeSection', 'schoolYear', 'livesWith', 'feelingAboutSchool', 'prefersPrivate', 'signatureReceived', 'followUpNeeded']
export const STUDENT_FILTERS = FILTER_IDS.map((id) => STUDENT_FIELDS.find((field) => field.id === id))

export const emptyStudentFilters = {
  search: '',
  from: '',
  to: '',
  ...Object.fromEntries(FILTER_IDS.map((id) => [id, ''])),
}

// No `to` means a single day (`from` only). Empty filters are ignored.
export function filterStudents(students, filters) {
  const keyword = filters.search.trim().toLowerCase()
  const { from, to } = filters
  return students.filter(
    (item) =>
      item.studentName.toLowerCase().includes(keyword) &&
      (!from || (item.dateEncoded >= from && item.dateEncoded <= (to || from))) &&
      FILTER_IDS.every((id) => !filters[id] || item[id] === filters[id]),
  )
}
