import { createSlice, nanoid } from '@reduxjs/toolkit'

const findCategory = (state, id) => state.categories.find((category) => category.id === id)

const optionsSlice = createSlice({
  name: 'options',
  // Category names must match form labels to show as dropdowns
  initialState: {
    categories: [
      { id: 'sex', name: 'Sex', options: ['Male', 'Female', 'Not provided'] },
      {
        id: 'grade-section',
        name: 'Grade & Section',
        options: ['Grade 3 - Duhat', 'Grade 4 - Mangga', 'Grade 5 - Narra', 'Grade 6 - Molave'],
      },
      {
        id: 'concern',
        name: 'Nature of Concern',
        options: ['Emotional / Mental Health', 'Academic', 'Behavioral', 'Family', 'Peer / Social'],
      },
      {
        id: 'action',
        name: 'Action / Service Rendered',
        options: ['Psychological First Aid', 'Individual Counseling', 'Parent Conference', 'Home Visitation'],
      },
      {
        id: 'referred-to',
        name: 'Referred To / Remarks',
        options: ['Referred to External Agency', 'Referred to Class Adviser', 'Referred to Principal', 'Not Referred'],
      },
      {
        id: 'classification',
        name: 'Intake Classification',
        options: ['Parent Request', 'Walk-in', 'Teacher Referral', 'Follow-up'],
      },
      // Students
      { id: 'school-year', name: 'School Year', options: ['2025-2026', '2026-2027'] },
      { id: 'relationship', name: 'Relationship', options: ['Mother', 'Father', 'Guardian', 'Grandparent', 'Sibling', 'Other'] },
      {
        id: 'lives-with',
        name: 'Who Student Lives With',
        options: ['Both Parents', 'Mother', 'Father', 'Guardian', 'Relatives', 'Other'],
      },
      {
        id: 'subjects',
        name: 'Subjects',
        options: ['English', 'Filipino', 'Math', 'Science', 'Araling Panlipunan', 'MAPEH', 'ESP', 'TLE'],
      },
      { id: 'feeling', name: 'Feeling About Going to School', options: ['Happy', 'Okay', 'Nervous', 'Unhappy'] },
      {
        id: 'talk-to',
        name: 'People Student Can Talk To',
        options: ['Parent', 'Teacher', 'Friend', 'Sibling', 'Guidance Counselor', 'No one'],
      },
      { id: 'help', name: 'Help Requested', options: ['Academic', 'Emotional', 'Social', 'Family', 'Career', 'None'] },
      { id: 'private', name: 'Prefers to Discuss Privately', options: ['Yes', 'No'] },
      { id: 'signature', name: 'Parent/Guardian Signature Received', options: ['Yes', 'No'] },
      { id: 'reviewed-by', name: 'Reviewed By', options: ['Guidance Counselor', 'Guidance Associate'] },
      { id: 'follow-up-needed', name: 'Follow-up Needed', options: ['Yes', 'No'] },
      {
        id: 'recommended',
        name: 'Recommended Actions',
        options: ['Individual Counseling', 'Parent Conference', 'Referral', 'Monitoring', 'None'],
      },
      // Appointments
      { id: 'staff', name: 'Assigned Staff', options: ['Ms. Reyes', 'Mr. Cruz', 'Ms. Garcia'] },
      { id: 'duration', name: 'Duration', options: ['15 minutes', '30 minutes', '45 minutes', '60 minutes', '90 minutes'] },
      {
        id: 'appointment-type',
        name: 'Appointment Type',
        options: ['Individual Counseling', 'Group Counseling', 'Parent Conference', 'Follow-up Session', 'Consultation'],
      },
      {
        id: 'reason',
        name: 'Reason / Category',
        options: ['Academic', 'Behavioral', 'Emotional / Mental Health', 'Family', 'Peer / Social', 'Career'],
      },
    ],
  },
  reducers: {
    addCategory: (state, action) => {
      state.categories.push({ id: nanoid(), name: action.payload, options: [] })
    },
    removeCategory: (state, action) => {
      state.categories = state.categories.filter((category) => category.id !== action.payload)
    },
    addOption: (state, action) => {
      const { categoryId, option } = action.payload
      findCategory(state, categoryId).options.push(option)
    },
    removeOption: (state, action) => {
      const { categoryId, option } = action.payload
      const category = findCategory(state, categoryId)
      category.options = category.options.filter((item) => item !== option)
    },
  },
})

export const { addCategory, removeCategory, addOption, removeOption } = optionsSlice.actions
export default optionsSlice.reducer
