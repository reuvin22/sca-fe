import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  // Mock signed-in user and school until login is connected to the backend
  initialState: {
    user: {
      fullName: 'ARVILEN A. DE GUZMAN',
      email: 'arvilen.deguzman@school.edu',
      role: 'School Counselor Associate',
      phone: '0917 123 4567',
    },
    school: {
      name: 'MULAWIN ELEMENTARY SCHOOL',
      schoolId: '137320',
      region: 'REGION III',
      division: 'CITY OF SAN JOSE DEL MONTE',
      schoolYear: '2026-2027',
      reportingMonth: 'October 2026',
      schoolHead: 'CHERIE ANN F. JARDIN',
      privacy: 'STRICTLY CONFIDENTIAL',
    },
  },
  reducers: {
    // payload: { user, school }
    setProfile: (state, action) => {
      state.user = action.payload.user
      state.school = action.payload.school
    },
  },
})

export const { setProfile } = authSlice.actions
export default authSlice.reducer
