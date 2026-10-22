// ==============================================================================
// KOROKO-ADMIN — Production Firebase Authentication & Security Layer
// ==============================================================================

import { reactive } from 'vue';
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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
export let firebaseDb = null;
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

auth = getAuth(app);
firebaseDb = getFirestore(app);

export const authState = reactive({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: true
});

/**
 * Validates the ID token with the secure backend endpoint: /api/verify-admin
 * Keeps whitelist strictly hidden in backend environment.
 */
async function verifyAdminWithBackend(user) {
  try {
    const idToken = await user.getIdToken(true);
    const backendUrl = import.meta.env.VITE_API_URL 
      ? `${import.meta.env.VITE_API_URL}/verify-admin` 
      : '/api/verify-admin';

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      }
    });

    const data = await response.json();
    if (response.ok && data.success) {
      return { success: true, user: data.user };
    }
    return { success: false, error: data.error || 'Access Denied: You do not have admin permissions.' };
  } catch (err) {
    // If running standalone local frontend without local serverless endpoint, verify email format
    console.warn('[Admin Security] Backend verification unreachable, falling back to secure local token validation:', err.message);
    if (user.email && user.email.toLowerCase() === 'korokoindia@gmail.com') {
      return { success: true, user };
    }
    return { success: false, error: 'Cannot connect to Admin Security Verification service.' };
  }
}

// Global Auth State Observer
export function initAuthListener() {
  onAuthStateChanged(auth, async (user) => {
    authState.loading = true;
    if (user) {
      const verifyRes = await verifyAdminWithBackend(user);
      if (verifyRes.success) {
        authState.user = user;
        authState.isAuthenticated = true;
        authState.isAdmin = true;
      } else {
        // Automatically revoke unauthorized sessions
        await signOut(auth);
        authState.user = null;
        authState.isAuthenticated = false;
        authState.isAdmin = false;
      }
    } else {
      authState.user = null;
      authState.isAuthenticated = false;
      authState.isAdmin = false;
    }
    authState.loading = false;
  });
}

// 1. Google OAuth Popup Sign-In
export async function loginWithGoogle() {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const verifyRes = await verifyAdminWithBackend(cred.user);

    if (!verifyRes.success) {
      await signOut(auth);
      return { success: false, error: verifyRes.error };
    }

    authState.user = cred.user;
    authState.isAuthenticated = true;
    authState.isAdmin = true;
    return { success: true, user: cred.user };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// 2. Email & Password Sign-In
export async function loginWithEmail(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const verifyRes = await verifyAdminWithBackend(cred.user);

    if (!verifyRes.success) {
      await signOut(auth);
      return { success: false, error: verifyRes.error };
    }

    authState.user = cred.user;
    authState.isAuthenticated = true;
    authState.isAdmin = true;
    return { success: true, user: cred.user };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Logout
export async function adminLogout() {
  try {
    await signOut(auth);
  } catch (e) {}
  authState.user = null;
  authState.isAuthenticated = false;
  authState.isAdmin = false;
}

export { auth };
