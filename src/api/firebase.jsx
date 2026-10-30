// Firebase setup. Values come from .env (see .env.example).
import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const app = initializeApp(firebaseConfig)

// "Continue with Google". The backend checks the Google token and returns our own login token.
export const firebaseAuth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

// When the auth domain is this site itself (Vercel proxies /__/auth to Firebase, see vercel.json),
// Google sign-in uses a full-page redirect: no popup, so no Cross-Origin-Opener-Policy console errors.
// Otherwise (e.g. localhost, or before the domain is switched) it uses the popup.
export const googleSignInByRedirect = firebaseConfig.authDomain === window.location.host

// Analytics only runs in browsers that support it (not in tests or blocked environments)
export const analyticsPromise = isSupported().then((supported) => (supported ? getAnalytics(app) : null))
