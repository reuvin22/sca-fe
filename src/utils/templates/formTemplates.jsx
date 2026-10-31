import { newQuestion, variableField } from '../formBuilderHelpers'

// Ready-made forms for the Forms builder. `header` lists system variables (e.g. 'name') or custom fields;
// `questions` are numbered. toBuilderForm() gives every item a fresh id when a template is used.
const q = (label, type = 'text', extra = {}) => ({ label, type, ...extra })
const section = (label) => ({ label, type: 'section' })
const choice = (label, options, extra = {}) => q(label, 'radio', { options, ...extra })
const checks = (label, options, extra = {}) => q(label, 'checkbox', { options, ...extra })
const grid = (columns) => ({ layout: 'grid', columns })
const OFTEN = ['Always', 'Often', 'Sometimes', 'Never']
const SCALE = ['1 - Poor', '2', '3', '4', '5 - Excellent']

export const FORM_TEMPLATES = [
  {
    id: 'student-info',
    name: 'Student Information Sheet',
    description: 'Personal and family background of a new student.',
    form: {
      title: 'Student Information Sheet',
      description: 'Please answer honestly. Your answers are kept confidential by the Guidance Office.',
      header: ['name', 'date', 'section', 'lrn', 'age', 'sex', 'contactNumber', 'address'],
      questions: [
        section('Family Background'),
        checks(
          'Who do you live with?',
          ['Both parents', 'Mother', 'Father', 'Guardian', 'Grandparents', 'Relatives'],
          grid(3),
        ),
        q('Name of parent / guardian', 'text', { width: 'half' }),
        q('Contact number of parent / guardian', 'tel', { width: 'half' }),
        q('Number of brothers and sisters', 'number', { width: 'half' }),
        q('Birth order (e.g. eldest, 2nd)', 'text', { width: 'half' }),
        section('About You'),
        checks(
          'Subjects you enjoy',
          ['English', 'Filipino', 'Math', 'Science', 'Araling Panlipunan', 'MAPEH', 'ESP', 'TLE'],
          grid(4),
        ),
        q('What are your hobbies and talents?', 'textarea'),
        q('Is there anything you want the Guidance Office to know about you?', 'textarea'),
      ],
    },
  },
  {
    id: 'needs-assessment',
    name: 'Counseling Needs Assessment',
    description: 'Find out which concerns students want help with.',
    form: {
      title: 'Counseling Needs Assessment',
      description: 'Check the concerns you want help with this school year.',
      header: ['name', 'date', 'section'],
      questions: [
        checks(
          'Academic concerns',
          ['Study habits', 'Time management', 'Low grades', 'Choosing a strand / course', 'Test anxiety'],
          grid(2),
        ),
        checks('Personal concerns', ['Stress', 'Self-confidence', 'Anger', 'Sadness', 'Health'], grid(2)),
        checks(
          'Social and family concerns',
          ['Friends', 'Bullying', 'Relationships', 'Family problems', 'Money matters'],
          grid(2),
        ),
        choice('How would you like to get help?', [
          'Individual counseling',
          'Group counseling',
          'Seminar / talk',
          'Not now',
        ]),
        q('Anything else you want to tell us?', 'textarea'),
      ],
    },
  },
  {
    id: 'wellness-checkin',
    name: 'Weekly Wellness Check-in',
    description: 'A quick weekly check of how students feel.',
    form: {
      title: 'Weekly Wellness Check-in',
      description: 'This takes one minute. There are no wrong answers.',
      header: ['name', 'date', 'section'],
      questions: [
        choice('How do you feel this week?', ['Very good', 'Good', 'Okay', 'Not good', 'Bad'], { required: true }),
        choice('How well did you sleep?', ['Very well', 'Okay', 'Badly']),
        choice('How stressed do you feel?', ['Not at all', 'A little', 'Quite a lot', 'Very stressed']),
        choice('Would you like to talk to a counselor?', ['Yes, soon', 'Maybe', 'No, thank you'], { required: true }),
        q('Is there anything you want to share?', 'textarea'),
      ],
    },
  },
  {
    id: 'session-feedback',
    name: 'Counseling Feedback Survey',
    description: 'Students rate a counseling session or seminar.',
    form: {
      title: 'Counseling Feedback Survey',
      description: 'Help us improve our guidance services. Rate each item from 1 (poor) to 5 (excellent).',
      header: ['date', 'section'],
      questions: [
        choice('I felt listened to and respected.', SCALE),
        choice('The counselor explained things clearly.', SCALE),
        choice('The session helped me with my concern.', SCALE),
        choice('I would come back to the Guidance Office.', ['Yes', 'Maybe', 'No']),
        q('What did you like most?', 'textarea'),
        q('What can we improve?', 'textarea'),
      ],
    },
  },
  {
    id: 'bullying-report',
    name: 'Bullying Incident Report',
    description: 'Students report bullying they experienced or saw.',
    form: {
      title: 'Bullying Incident Report',
      description: 'Thank you for speaking up. This report is confidential.',
      header: ['name', 'date', 'section'],
      questions: [
        choice('You are reporting as', ['The one bullied', 'A witness', 'A friend of the one bullied']),
        q('When did it happen?', 'date', { width: 'half' }),
        q('Where did it happen?', 'text', { width: 'half' }),
        checks(
          'What kind of bullying?',
          ['Physical', 'Verbal', 'Social (left out)', 'Online / cyber', 'Others'],
          grid(3),
        ),
        q('What happened? Please describe.', 'textarea', { required: true }),
        q('Who was involved?', 'textarea'),
        choice('Have you told a teacher or parent?', ['Yes', 'No']),
      ],
    },
  },
  {
    id: 'career-interest',
    name: 'Career Interest Survey',
    description: 'Strand and career interests for career guidance.',
    form: {
      title: 'Career Interest Survey',
      description: 'Your answers help us plan career guidance activities.',
      header: ['name', 'date', 'section'],
      questions: [
        choice(
          'Which strand / track interests you most?',
          ['STEM', 'ABM', 'HUMSS', 'GAS', 'TVL', 'Sports', 'Arts and Design'],
          grid(4),
        ),
        q('What job or career do you dream of?', 'text'),
        checks(
          'What are you good at?',
          [
            'Numbers',
            'Writing',
            'Speaking',
            'Drawing / design',
            'Building / fixing',
            'Helping people',
            'Sports',
            'Music',
          ],
          grid(4),
        ),
        choice('After senior high school, you plan to', [
          'Go to college',
          'Take a technical course',
          'Work',
          'Not sure yet',
        ]),
        q('Who influences your career choice the most?', 'text'),
      ],
    },
  },
  {
    id: 'parent-info',
    name: 'Parent / Guardian Information Sheet',
    description: 'Contact details and concerns of parents.',
    form: {
      title: 'Parent / Guardian Information Sheet',
      description: 'To be filled out by the parent or guardian.',
      header: ['date'],
      questions: [
        q('Name of your child', 'text', { width: 'two-thirds', required: true }),
        q('Grade & Section', 'text', { width: 'third' }),
        q('Your full name', 'text', { width: 'half', required: true }),
        choice('Relationship to the student', ['Mother', 'Father', 'Guardian', 'Others'], { width: 'half' }),
        q('Contact number', 'tel', { width: 'half', required: true }),
        q('Email', 'email', { width: 'half' }),
        q('Occupation', 'text', { width: 'half' }),
        choice('Best time to contact you', ['Morning', 'Afternoon', 'Evening'], { width: 'half' }),
        q('Do you have concerns about your child that we should know?', 'textarea'),
      ],
    },
  },
  {
    id: 'study-habits',
    name: 'Study Habits Inventory',
    description: 'How often students practice good study habits.',
    form: {
      title: 'Study Habits Inventory',
      description: 'Choose how often each statement is true for you.',
      header: ['name', 'date', 'section'],
      questions: [
        choice('I study at a regular time every day.', OFTEN),
        choice('I have a quiet place to study.', OFTEN),
        choice('I finish my assignments on time.', OFTEN),
        choice('I review my notes before a test.', OFTEN),
        choice('I ask my teacher when I do not understand.', OFTEN),
        choice('I get distracted by my phone while studying.', OFTEN),
        q('What makes studying hard for you?', 'textarea'),
      ],
    },
  },
  {
    id: 'event-registration',
    name: 'Seminar / Event Registration',
    description: 'Sign-ups for a guidance seminar or activity.',
    form: {
      title: 'Seminar Registration',
      description: 'Register for the guidance seminar. Seats are limited.',
      header: ['name', 'section', 'email', 'contactNumber'],
      questions: [
        checks('Which sessions will you attend?', ['Morning session', 'Afternoon session']),
        choice('Have you attended a guidance seminar before?', ['Yes', 'No']),
        q('What do you hope to learn?', 'textarea'),
      ],
    },
  },
  {
    id: 'teacher-referral',
    name: 'Teacher Referral Form',
    description: 'Teachers refer a student to the Guidance Office.',
    form: {
      title: 'Teacher Referral Form',
      description: 'To be filled out by the referring teacher.',
      header: ['name', 'section', 'date', 'instructor'],
      questions: [
        checks(
          'Reason for referral',
          ['Academic', 'Behavioral', 'Attendance', 'Emotional', 'Family', 'Peer / social'],
          { ...grid(3), required: true },
        ),
        q('Describe what you observed.', 'textarea', { required: true }),
        q('What have you already done to help?', 'textarea'),
        choice('How urgent is this?', ['Urgent', 'Within this week', 'When available']),
      ],
    },
  },
]

// The template as a builder form: header variables become their usual fields, everything gets a new id
export function toBuilderForm({ form }) {
  return {
    title: form.title,
    description: form.description,
    header: form.header.map((item) => (typeof item === 'string' ? variableField(item) : newQuestion(item))),
    questions: form.questions.map((item) => newQuestion(item)),
  }
}
