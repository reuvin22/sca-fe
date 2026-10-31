// Answer types in the question dropdown (one per HTML form input)
export const QUESTION_TYPES = [
  { value: 'section', label: 'Section heading' },
  { value: 'text', label: 'Short answer' },
  { value: 'textarea', label: 'Long answer (paragraph)' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone number' },
  { value: 'url', label: 'Link (URL)' },
  { value: 'date', label: 'Date' },
  { value: 'time', label: 'Time' },
  { value: 'datetime-local', label: 'Date and time' },
  { value: 'month', label: 'Month' },
  { value: 'week', label: 'Week' },
  { value: 'select', label: 'Dropdown' },
  { value: 'radio', label: 'Multiple choice (radio)' },
  { value: 'checkbox', label: 'Checkboxes' },
  { value: 'range', label: 'Slider (range)' },
  { value: 'color', label: 'Color' },
  { value: 'file', label: 'File upload' },
]

// Share of the row (out of 12 columns). Smaller fields sit side by side, like "Full name ... Date".
export const WIDTHS = { full: 12, 'two-thirds': 8, half: 6, third: 4 }
export const WIDTH_OPTIONS = [
  { value: 'full', label: 'Full row' },
  { value: 'two-thirds', label: '2/3 of row' },
  { value: 'half', label: 'Half row' },
  { value: 'third', label: '1/3 of row' },
]

// Types where the creator types the choices
export const OPTION_TYPES = ['select', 'radio', 'checkbox']
// Types where the choices can show in a row (flex) or in columns (grid)
export const LAYOUT_TYPES = ['radio', 'checkbox']

export const LAYOUT_OPTIONS = [
  { value: 'flex', label: 'In a row' },
  { value: 'grid', label: 'Grid (columns)' },
]

export const COLUMN_OPTIONS = [2, 3, 4].map((value) => ({ value: String(value), label: `${value} columns` }))

// Preset fields added with one click. `variable` lets answers be matched to students later.
export const VARIABLES = [
  { variable: 'name', label: 'Full Name', type: 'text', width: 'two-thirds', parts: ['First', 'Middle', 'Last'] },
  { variable: 'date', label: 'Date', type: 'date', width: 'third' },
  {
    variable: 'address',
    label: 'Address',
    type: 'text',
    parts: ['House No. / Street', 'Barangay', 'City / Municipality', 'Province', 'ZIP Code'],
  },
  { variable: 'section', label: 'Grade & Section', type: 'text', width: 'half' },
  { variable: 'instructor', label: 'Instructor / Adviser', type: 'text', width: 'half' },
  { variable: 'lrn', label: 'LRN', type: 'text', width: 'half' },
  { variable: 'age', label: 'Age', type: 'number', width: 'third' },
  { variable: 'sex', label: 'Sex', type: 'checkbox', width: 'third', options: ['Male', 'Female'] },
  { variable: 'contactNumber', label: 'Contact Number', type: 'tel', width: 'half' },
  { variable: 'email', label: 'Email', type: 'email', width: 'half' },
  { variable: 'schoolYear', label: 'School Year', type: 'text', width: 'third' },
]

export const newQuestion = (preset = {}) => ({
  id: crypto.randomUUID(),
  label: '',
  type: 'text',
  required: false,
  options: [],
  layout: 'flex',
  columns: 2,
  width: 'full',
  parts: [],
  variable: '',
  ...preset,
})

// Header field from a variable preset (e.g. "Full Name" with First / Middle / Last)
export const variableField = (variable) => {
  const { label, ...preset } = VARIABLES.find((item) => item.variable === variable)
  return newQuestion({ variable, label, ...preset, required: true })
}

// New forms start with the usual student details in the header and one empty question
export const emptyFormBuilder = () => ({
  title: '',
  description: '',
  header: [variableField('name'), variableField('date'), variableField('section')],
  questions: [newQuestion()],
})

// Question numbers (section headings are not numbered): [{ ...question, number }]
export function numberQuestions(questions) {
  let count = 0
  return questions.map((question) => (question.type === 'section' ? question : { ...question, number: ++count }))
}

// Errors keyed by field: { title, [itemId]: { label, options } } (header fields and questions)
export function validateFormBuilder(form) {
  const errors = {}
  if (!form.title.trim()) errors.title = 'Title is required.'
  for (const question of [...form.header, ...form.questions]) {
    const questionErrors = {}
    if (!question.label.trim()) questionErrors.label = 'Type the question.'
    if (OPTION_TYPES.includes(question.type) && !question.options.length)
      questionErrors.options = 'Add at least one option.'
    if (Object.keys(questionErrors).length) errors[question.id] = questionErrors
  }
  return errors
}

// Printed label: "1. How are you feeling?" for numbered questions,
// "FULL NAME:" for header fields (no extra colon after "?" or ":")
export const fieldLabel = (question) => {
  if (question.number) return `${question.number}. ${question.label.trim()}`
  const text = question.label.trim().toUpperCase()
  return /[?:]$/.test(text) ? text : `${text}:`
}

// Groups questions into printed rows: fields share a row until their widths fill 12 columns.
// Section headings always take a whole row.
export function toRows(questions) {
  const rows = []
  let row = []
  let used = 0
  for (const question of questions) {
    const span = question.type === 'section' ? 12 : WIDTHS[question.width ?? 'full']
    if (used + span > 12 && row.length) {
      rows.push(row)
      row = []
      used = 0
    }
    row.push({ ...question, span })
    used += span
  }
  if (row.length) rows.push(row)
  return rows
}

// Printed rows: the header grid first, then the numbered questions.
// The first question row is marked `startsQuestions` so exports can add space before it.
export function printRows(form) {
  const header = toRows(form.header ?? [])
  const questions = toRows(numberQuestions(form.questions))
  if (header.length && questions.length) questions[0][0].startsQuestions = true
  return [...header, ...questions]
}
