import { createSlice } from '@reduxjs/toolkit'
import { getToken } from '../utils/authStorage'

const authSlice = createSlice({
  name: 'auth',
  // Mock signed-in user and school until login is connected to the backend
  initialState: {
    token: getToken(),
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
    // payload: { token, profile: { user, school } } from the backend
    signIn: (state, action) => {
      const { token, profile } = action.payload
      state.token = token
      state.user = profile.user
      state.school = profile.school
    },
  },
})

export const { setProfile, signIn } = authSlice.actions
export default authSlice.reducer
