import { toDateString } from '../dateHelpers'

// Ready-made school counseling documents. Each template is a list of blocks; {{key}} marks a detail the
// user fills in (see VARIABLES). Blocks: letterhead, title, subtitle, heading, paragraph, fields
// ([label, value] pairs), lines (blanks to write on), checklist, signatures, note, spacer.
// The same blocks are laid out as PDF pages (templateLayout) and as a Word file (templateDocx).

// Every detail a template can ask for. `type`: text (default), date, textarea.
export const VARIABLES = {
  region: { label: 'DepEd Region' },
  division: { label: 'Schools Division' },
  schoolName: { label: 'School Name' },
  schoolAddress: { label: 'School Address' },
  schoolYear: { label: 'School Year' },
  schoolHead: { label: 'School Head' },
  counselorName: { label: 'Counselor Name' },
  counselorPosition: { label: 'Counselor Position' },
  date: { label: 'Date', type: 'date' },
  studentName: { label: 'Student Name' },
  lrn: { label: 'LRN' },
  gradeSection: { label: 'Grade & Section' },
  age: { label: 'Age' },
  adviserName: { label: 'Class Adviser' },
  parentName: { label: 'Parent / Guardian' },
  parentContact: { label: 'Parent Contact Number' },
  address: { label: 'Home Address' },
  referredBy: { label: 'Referred By' },
  reason: { label: 'Reason / Concern', type: 'textarea' },
  meetingDate: { label: 'Meeting Date', type: 'date' },
  meetingTime: { label: 'Meeting Time' },
  venue: { label: 'Venue' },
  purpose: { label: 'Purpose', type: 'textarea' },
  incidentDate: { label: 'Date of Incident', type: 'date' },
  incidentPlace: { label: 'Place of Incident' },
  description: { label: 'Description', type: 'textarea' },
  sessionNumber: { label: 'Session No.' },
  goals: { label: 'Goals / Agreements', type: 'textarea' },
  caseNumber: { label: 'Case No.' },
}

const LETTERHEAD = { type: 'letterhead' }
const STUDENT = [
  ['Name of Student', '{{studentName}}'],
  ['Grade & Section', '{{gradeSection}}'],
  ['LRN', '{{lrn}}'],
  ['Date', '{{date}}'],
]

export const TEMPLATES = [
  {
    id: 'referral',
    name: 'Guidance Referral Form',
    description: 'A teacher refers a student to the guidance office.',
    blocks: [
      LETTERHEAD,
      { type: 'title', text: 'Guidance Referral Form' },
      {
        type: 'fields',
        columns: 2,
        items: [...STUDENT, ['Class Adviser', '{{adviserName}}'], ['Referred By', '{{referredBy}}']],
      },
      { type: 'heading', text: 'Reason for Referral' },
      {
        type: 'checklist',
        columns: 3,
        options: ['Academic', 'Behavioral', 'Attendance', 'Emotional', 'Family', 'Peer / Social'],
      },
      { type: 'heading', text: 'Details of the Concern' },
      { type: 'paragraph', text: '{{reason}}' },
      { type: 'heading', text: 'Actions Already Taken by the Teacher' },
      { type: 'lines', count: 3 },
      {
        type: 'signatures',
        items: [
          ['{{referredBy}}', 'Referring Teacher'],
          ['{{counselorName}}', 'Received by'],
        ],
      },
    ],
  },
  {
    id: 'parent-invitation',
    name: 'Parent Conference Invitation',
    description: 'Invites a parent or guardian to a meeting at school.',
    blocks: [
      LETTERHEAD,
      { type: 'paragraph', text: '{{date}}' },
      { type: 'paragraph', text: 'Dear {{parentName}},' },
      {
        type: 'paragraph',
        text: 'Greetings! We respectfully invite you to a conference at the Guidance Office of {{schoolName}} regarding your child, {{studentName}} of {{gradeSection}}. The meeting is scheduled on {{meetingDate}} at {{meetingTime}} at {{venue}}.',
      },
      { type: 'paragraph', text: 'Purpose of the meeting: {{purpose}}' },
      {
        type: 'paragraph',
        text: 'Your presence is very important to help us support your child. If you are unable to attend, kindly inform us so we can set another schedule.',
      },
      { type: 'paragraph', text: 'Thank you for your cooperation.' },
      { type: 'signatures', items: [['{{counselorName}}', '{{counselorPosition}}']] },
      { type: 'note', text: 'Please return the slip below to the class adviser.' },
      {
        type: 'fields',
        columns: 1,
        items: [['I will attend / I cannot attend (please encircle). Signature of Parent / Guardian', '']],
      },
    ],
  },
  {
    id: 'good-moral',
    name: 'Certificate of Good Moral Character',
    description: 'Certifies a student’s good conduct while enrolled.',
    blocks: [
      LETTERHEAD,
      { type: 'spacer', size: 16 },
      { type: 'title', text: 'Certificate of Good Moral Character' },
      { type: 'spacer', size: 12 },
      { type: 'paragraph', text: 'TO WHOM IT MAY CONCERN:' },
      {
        type: 'paragraph',
        text: 'This is to certify that {{studentName}}, with LRN {{lrn}}, a student of {{gradeSection}} of {{schoolName}} for the School Year {{schoolYear}}, has shown good moral character and has not been subjected to any disciplinary action during the stay in this school.',
      },
      {
        type: 'paragraph',
        text: 'This certification is issued upon the request of the above-named student for whatever legal purpose it may serve.',
      },
      { type: 'paragraph', text: 'Given this {{date}} at {{schoolName}}.' },
      {
        type: 'signatures',
        items: [
          ['{{counselorName}}', '{{counselorPosition}}'],
          ['{{schoolHead}}', 'School Head'],
        ],
      },
      { type: 'note', text: 'Not valid without the school seal.' },
    ],
  },
  {
    id: 'consent',
    name: 'Counseling Consent Form',
    description: 'Parent or guardian consent for counseling services.',
    blocks: [
      LETTERHEAD,
      { type: 'title', text: 'Parent / Guardian Consent for Counseling' },
      {
        type: 'fields',
        columns: 2,
        items: [...STUDENT, ['Parent / Guardian', '{{parentName}}'], ['Contact Number', '{{parentContact}}']],
      },
      {
        type: 'paragraph',
        text: 'I, {{parentName}}, parent / guardian of {{studentName}}, give my consent for my child to receive guidance and counseling services at {{schoolName}}. I understand that the counseling sessions are confidential, except when there is a risk of harm to my child or to others, or when disclosure is required by law.',
      },
      {
        type: 'paragraph',
        text: 'I also understand that I may withdraw this consent at any time by informing the Guidance Office in writing.',
      },
      { type: 'checklist', columns: 1, options: ['I give my consent.', 'I do not give my consent.'] },
      {
        type: 'signatures',
        items: [
          ['{{parentName}}', 'Parent / Guardian'],
          ['{{counselorName}}', '{{counselorPosition}}'],
        ],
      },
    ],
  },
  {
    id: 'session-record',
    name: 'Counseling Session Record',
    description: 'Notes of one counseling session. Confidential.',
    blocks: [
      LETTERHEAD,
      { type: 'title', text: 'Counseling Session Record' },
      { type: 'note', text: 'CONFIDENTIAL — for the Guidance Office only.' },
      {
        type: 'fields',
        columns: 2,
        items: [...STUDENT, ['Case No.', '{{caseNumber}}'], ['Session No.', '{{sessionNumber}}']],
      },
      { type: 'heading', text: 'Presenting Concern' },
      { type: 'paragraph', text: '{{reason}}' },
      { type: 'heading', text: 'Summary of the Session' },
      { type: 'lines', count: 5 },
      { type: 'heading', text: 'Goals / Agreements' },
      { type: 'paragraph', text: '{{goals}}' },
      { type: 'heading', text: 'Next Steps' },
      {
        type: 'checklist',
        columns: 2,
        options: ['Follow-up session', 'Parent conference', 'Referral to specialist', 'Case closed'],
      },
      { type: 'signatures', items: [['{{counselorName}}', '{{counselorPosition}}']] },
    ],
  },
  {
    id: 'home-visit',
    name: 'Home Visitation Report',
    description: 'Findings and agreements from a home visit.',
    blocks: [
      LETTERHEAD,
      { type: 'title', text: 'Home Visitation Report' },
      {
        type: 'fields',
        columns: 2,
        items: [
          ...STUDENT,
          ['Parent / Guardian', '{{parentName}}'],
          ['Contact Number', '{{parentContact}}'],
          ['Home Address', '{{address}}'],
        ],
      },
      { type: 'heading', text: 'Purpose of the Visit' },
      { type: 'paragraph', text: '{{purpose}}' },
      { type: 'heading', text: 'Observations' },
      { type: 'lines', count: 4 },
      { type: 'heading', text: 'Agreements with the Family' },
      { type: 'paragraph', text: '{{goals}}' },
      {
        type: 'signatures',
        items: [
          ['{{counselorName}}', 'Visited by'],
          ['{{parentName}}', 'Parent / Guardian'],
        ],
      },
    ],
  },
  {
    id: 'incident',
    name: 'Incident Report',
    description: 'Records what happened in a school incident.',
    blocks: [
      LETTERHEAD,
      { type: 'title', text: 'Incident Report' },
      {
        type: 'fields',
        columns: 2,
        items: [
          ...STUDENT,
          ['Date of Incident', '{{incidentDate}}'],
          ['Place of Incident', '{{incidentPlace}}'],
          ['Reported By', '{{referredBy}}'],
        ],
      },
      { type: 'heading', text: 'Type of Incident' },
      {
        type: 'checklist',
        columns: 3,
        options: ['Bullying', 'Fighting', 'Cutting classes', 'Vandalism', 'Cheating', 'Others'],
      },
      { type: 'heading', text: 'Description of the Incident' },
      { type: 'paragraph', text: '{{description}}' },
      { type: 'heading', text: 'Persons Involved / Witnesses' },
      { type: 'lines', count: 3 },
      { type: 'heading', text: 'Action Taken' },
      { type: 'lines', count: 3 },
      {
        type: 'signatures',
        items: [
          ['{{referredBy}}', 'Reported by'],
          ['{{counselorName}}', '{{counselorPosition}}'],
        ],
      },
    ],
  },
  {
    id: 'behavior-contract',
    name: 'Behavior Contract',
    description: 'Goals the student agrees to, signed by everyone.',
    blocks: [
      LETTERHEAD,
      { type: 'title', text: 'Student Behavior Contract' },
      { type: 'fields', columns: 2, items: STUDENT },
      {
        type: 'paragraph',
        text: 'I, {{studentName}}, agree to work on the following goals to improve my behavior in school. I understand that my parent / guardian, my adviser and the Guidance Office will support me and check my progress.',
      },
      { type: 'heading', text: 'My Goals' },
      { type: 'paragraph', text: '{{goals}}' },
      { type: 'heading', text: 'Support I Will Receive' },
      { type: 'lines', count: 2 },
      { type: 'heading', text: 'Progress Check' },
      {
        type: 'fields',
        columns: 2,
        items: [
          ['Review date', '{{meetingDate}}'],
          ['Reviewed by', '{{counselorName}}'],
        ],
      },
      {
        type: 'signatures',
        items: [
          ['{{studentName}}', 'Student'],
          ['{{parentName}}', 'Parent / Guardian'],
          ['{{adviserName}}', 'Class Adviser'],
          ['{{counselorName}}', '{{counselorPosition}}'],
        ],
      },
    ],
  },
  {
    id: 'call-slip',
    name: 'Guidance Call Slip',
    description: 'Calls a student to the guidance office.',
    blocks: [
      LETTERHEAD,
      { type: 'title', text: 'Guidance Call Slip' },
      {
        type: 'fields',
        columns: 2,
        items: [
          ['To', '{{studentName}}'],
          ['Grade & Section', '{{gradeSection}}'],
          ['Class Adviser', '{{adviserName}}'],
          ['Date', '{{date}}'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Please proceed to the Guidance Office on {{meetingDate}} at {{meetingTime}}. Kindly show this slip to your subject teacher.',
      },
      { type: 'paragraph', text: 'Purpose: {{purpose}}' },
      { type: 'signatures', items: [['{{counselorName}}', '{{counselorPosition}}']] },
      { type: 'heading', text: 'Teacher’s Acknowledgment' },
      {
        type: 'fields',
        columns: 2,
        items: [
          ['Time out of class', ''],
          ['Teacher’s signature', ''],
        ],
      },
    ],
  },
  {
    id: 'case-closure',
    name: 'Case Summary & Closure Report',
    description: 'Summary of a case when counseling ends.',
    blocks: [
      LETTERHEAD,
      { type: 'title', text: 'Case Summary and Closure Report' },
      { type: 'note', text: 'CONFIDENTIAL — for the Guidance Office only.' },
      {
        type: 'fields',
        columns: 2,
        items: [...STUDENT, ['Case No.', '{{caseNumber}}'], ['Referred By', '{{referredBy}}']],
      },
      { type: 'heading', text: 'Presenting Concern' },
      { type: 'paragraph', text: '{{reason}}' },
      { type: 'heading', text: 'Interventions Given' },
      {
        type: 'checklist',
        columns: 2,
        options: [
          'Individual counseling',
          'Group counseling',
          'Parent conference',
          'Home visitation',
          'Referral to specialist',
          'Others',
        ],
      },
      { type: 'heading', text: 'Outcome and Recommendations' },
      { type: 'paragraph', text: '{{goals}}' },
      { type: 'heading', text: 'Reason for Closing the Case' },
      { type: 'checklist', columns: 2, options: ['Goals achieved', 'Transferred school', 'Referred out', 'Others'] },
      {
        type: 'signatures',
        items: [
          ['{{counselorName}}', '{{counselorPosition}}'],
          ['{{schoolHead}}', 'School Head'],
        ],
      },
    ],
  },
]

const KEY = /\{\{(\w+)\}\}/g

// The details a template asks for, in the order they first appear (letterhead details first)
export function templateVariables(template) {
  const keys = new Set()
  if (template.blocks.some((block) => block.type === 'letterhead'))
    ['region', 'division', 'schoolName'].forEach((key) => keys.add(key))
  const scan = (text) => [...String(text).matchAll(KEY)].forEach((match) => keys.add(match[1]))
  for (const block of template.blocks) {
    scan(block.text ?? '')
    for (const item of block.items ?? []) item.forEach(scan)
  }
  return [...keys].filter((key) => VARIABLES[key]).map((key) => ({ key, ...VARIABLES[key] }))
}

// Puts the details in; empty ones become a blank line to write on (or `blank`, e.g. '' for signature names)
export const fillText = (text, values, blank = '________________') =>
  String(text).replace(KEY, (_, key) => values[key]?.trim() || blank)

// Details already known from the profile and school, and today's date
export function knownValues(user, school) {
  return {
    region: school?.region ?? '',
    division: school?.division ?? '',
    schoolName: school?.name ?? '',
    schoolYear: school?.schoolYear ?? '',
    schoolHead: school?.schoolHead ?? '',
    counselorName: user?.fullName ?? '',
    counselorPosition: user?.role || 'School Counselor Associate',
    date: toDateString(),
  }
}
