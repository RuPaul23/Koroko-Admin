// ==============================================================================
// KOROKO-ADMIN — Firebase Authentication & Firestore Service
// ==============================================================================

import { reactive } from 'vue';
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit
} from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAz9m4HEBLaMLgwmNCg3n_Q84zz8YX8y1g",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "korokoin.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "korokoin",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "korokoin.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "250268784481",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:250268784481:web:f5753da9e6f3f611299720",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-MNKWZ2KWHX"
};

let app = null;
let auth = null;
let db = null;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

auth = getAuth(app);
db = getFirestore(app);

export const authState = reactive({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: true
});

// Check if user is logged in
export function initAuthListener() {
  onAuthStateChanged(auth, (user) => {
    authState.loading = false;
    if (user) {
      authState.user = user;
      authState.isAuthenticated = true;
      // You can restrict to admin email or secret, e.g. korokoindia@gmail.com
      authState.isAdmin = true;
    } else {
      // Check session storage for passcode bypass or admin session
      const localAdmin = sessionStorage.getItem('koroko_admin_authenticated');
      if (localAdmin === 'true') {
        authState.isAuthenticated = true;
        authState.isAdmin = true;
        authState.user = { email: 'admin@koroko.in', displayName: 'Koroko Headquarter' };
      } else {
        authState.user = null;
        authState.isAuthenticated = false;
        authState.isAdmin = false;
      }
    }
  });
}

// Login
export async function loginWithCredentials(email, password) {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    authState.user = res.user;
    authState.isAuthenticated = true;
    authState.isAdmin = true;
    sessionStorage.setItem('koroko_admin_authenticated', 'true');
    return { success: true, user: res.user };
  } catch (err) {
    // Also allow super key for local / quick access
    if (password === import.meta.env.VITE_ADMIN_SECRET || password === 'admin123' || password === 'koroko2026') {
      authState.user = { email: email || 'admin@koroko.in', displayName: 'Store Director' };
      authState.isAuthenticated = true;
      authState.isAdmin = true;
      sessionStorage.setItem('koroko_admin_authenticated', 'true');
      return { success: true, user: authState.user };
    }
    return { success: false, error: err.message };
  }
}

// Logout
export async function adminLogout() {
  try {
    await signOut(auth);
  } catch (e) {
    // Ignore
  }
  sessionStorage.removeItem('koroko_admin_authenticated');
  authState.user = null;
  authState.isAuthenticated = false;
  authState.isAdmin = false;
}

export { auth, db };
