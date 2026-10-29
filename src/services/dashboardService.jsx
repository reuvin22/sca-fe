// Mock API. Replace with real axios calls when the backend is ready.
const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))

const dashboard = {
  stats: [
    { label: 'Students', value: '1,240', color: 'from-orange-400 to-amber-300' },
    { label: 'Appointments', value: '72', color: 'from-sky-500 to-cyan-300' },
    { label: 'Referrals', value: '18', color: 'from-emerald-500 to-green-400' },
    { label: 'Follow-ups', value: '35', color: 'from-purple-600 to-fuchsia-500' },
  ],
  progress: [
    { label: 'Attendance', note: 'Sessions attended', value: 77, color: 'stroke-amber-400' },
    { label: 'Pending', note: 'Awaiting follow-up', value: 29, color: 'stroke-sky-400' },
    { label: 'Resolved', note: 'Closed cases', value: 86, color: 'stroke-emerald-500' },
  ],
  monthly: [
    { month: 'Jan', value: 9, color: 'bg-emerald-500' },
    { month: 'Feb', value: 5, color: 'bg-fuchsia-600' },
    { month: 'Mar', value: 6, color: 'bg-emerald-500' },
    { month: 'Apr', value: 9, color: 'bg-fuchsia-600' },
    { month: 'May', value: 8, color: 'bg-emerald-500' },
    { month: 'Jun', value: 5, color: 'bg-fuchsia-600' },
  ],
  sessions: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [120, 380, 180, 340, 150, 290, 220],
    rings: [
      { label: 'Group', value: 85, color: 'stroke-orange-400' },
      { label: 'Individual', value: 71, color: 'stroke-red-400' },
      { label: 'Family', value: 68, color: 'stroke-amber-400' },
    ],
  },
  concerns: {
    bars: [
      { label: 'Academic', value: 28.5 },
      { label: 'Behavior', value: 36.7 },
      { label: 'Family', value: 11.4 },
      { label: 'Career', value: 56.9 },
      { label: 'Wellness', value: 41.2 },
    ],
    rings: [
      { label: 'Grade 10', value: 25, color: 'stroke-purple-500' },
      { label: 'Grade 11', value: 46, color: 'stroke-purple-500' },
      { label: 'Grade 12', value: 82, color: 'stroke-purple-500' },
    ],
  },
  nextAppointment: { date: 'Saturday, 23', time: '10:00 AM', student: 'Maria Santos' },
}

export async function getDashboard() {
  await delay()
  return dashboard
}
