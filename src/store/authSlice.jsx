import { createSlice } from '@reduxjs/toolkit'
import { getToken } from '../utils/authStorage'

const authSlice = createSlice({
  name: 'auth',
  // `user` and `school` are loaded from the backend after sign-in (see RequireAuth)
  initialState: {
    token: getToken(),
    user: null,
    school: null,
    // Temporary URL of the downloaded profile photo, or null (see useLoadProfilePhoto)
    photoUrl: null,
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
    signOut: (state) => {
      state.token = null
      state.user = null
      state.school = null
      state.photoUrl = null
    },
    setPhotoUrl: (state, action) => {
      state.photoUrl = action.payload
    },
  },
})

export const { setProfile, signIn, signOut, setPhotoUrl } = authSlice.actions
export default authSlice.reducer
