// ==============================================================================
// KOROKO-ADMIN — Serverless Backend Admin Verification Handler
// Verifies user Google/Firebase Auth ID Token against approved Admin whitelist
// ==============================================================================

import path from 'node:path';
import fs from 'node:fs';

function loadEnvFile() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const separator = trimmed.indexOf('=');
        if (separator <= 0) continue;
        const key = trimmed.slice(0, separator).trim();
        const value = trimmed.slice(separator + 1).trim();
        if (!process.env[key]) process.env[key] = value;
      }
    }
  } catch (e) {}
}

loadEnvFile();

// Pre-whitelisted admin addresses
const DEFAULT_ADMIN_EMAILS = [
  'korokoindia@gmail.com'
];

export default async function handler(req, res) {
  // Set CORS headers for admin.koroko.in and localhost
  const origin = req.headers.origin || '';
  const allowed = [
    'https://admin.koroko.in',
    'https://koroko-admin.vercel.app',
    'http://localhost:5174',
    'http://localhost:5173'
  ];

  if (allowed.includes(origin) || origin.endsWith('.vercel.app')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

    if (!idToken) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Missing Firebase ID Token' });
    }

    const firebaseApiKey = process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || 'AIzaSyAz9m4HEBLaMLgwmNCg3n_Q84zz8YX8y1g';

    // Verify token with Google Identity Toolkit (Backend to Google)
    const googleRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(firebaseApiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      }
    );

    if (!googleRes.ok) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token or expired session' });
    }

    const googleData = await googleRes.json();
    const user = googleData.users?.[0];

    if (!user || !user.email) {
      return res.status(401).json({ success: false, error: 'Unauthorized: No email associated with account' });
    }

    // Backend Whitelist Check (Hidden from frontend)
    const envAdminEmails = (process.env.ADMIN_ALLOWED_EMAILS || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);

    const authorizedList = [...new Set([...DEFAULT_ADMIN_EMAILS, ...envAdminEmails])];
    const userEmail = user.email.toLowerCase();

    const isAuthorized = authorizedList.includes(userEmail);

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        error: `Access Denied: ${user.email} is not granted administrative rights. Contact Koroko HQ.`
      });
    }

    // Return authenticated admin session
    return res.status(200).json({
      success: true,
      user: {
        uid: user.localId,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoUrl: user.photoUrl || null,
        role: 'SUPER_ADMIN'
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || 'Internal verification error' });
  }
}
