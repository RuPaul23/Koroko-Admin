<template>
  <div class="login-page-wrapper">
    <div class="login-card">
      <div class="brand-top">
        <div class="brand-badge-large">K</div>
        <h1 class="brand-title font-display">KOROKO ADMIN</h1>
        <p class="brand-desc">Master Operations Control Portal • admin.koroko.in</p>
      </div>

      <!-- Security Notice -->
      <div class="security-lock-pill">
        <span class="lock-icon">🔒</span>
        <span>Restricted Access: Whitelisted Google Admin Account Only</span>
      </div>

      <!-- Google Sign-In (Primary Admin Method) -->
      <div class="auth-buttons-group">
        <button 
          type="button" 
          @click="handleGoogleSignIn" 
          class="google-sign-in-btn font-tech"
          :disabled="loading"
        >
          <svg class="google-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span v-if="!loading">SIGN IN WITH ADMIN GOOGLE ACCOUNT</span>
          <span v-else>VERIFYING BACKEND PERMISSIONS...</span>
        </button>
      </div>

      <div class="divider">
        <span>OR EMAIL AUTHENTICATION</span>
      </div>

      <form @submit.prevent="handleEmailSignIn" class="login-form">
        <div class="form-group">
          <label>Authorized Email Address</label>
          <div class="input-wrapper">
            <input 
              v-model="email" 
              type="email" 
              placeholder="e.g. korokoindia@gmail.com" 
              required 
            />
          </div>
        </div>

        <div class="form-group">
          <label>Password</label>
          <div class="input-wrapper">
            <input 
              v-model="password" 
              type="password" 
              placeholder="••••••••••••" 
              required 
            />
          </div>
        </div>

        <div v-if="errorMessage" class="error-banner">
          {{ errorMessage }}
        </div>

        <button type="submit" class="submit-btn font-tech" :disabled="loading">
          <span v-if="!loading">VERIFY CREDENTIALS &rarr;</span>
          <span v-else>CONNECTING...</span>
        </button>
      </form>

      <div class="login-footer">
        <span>Backend Zero Trust Enforcement • Unauthorized logins are rejected by the server</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginWithGoogle, loginWithEmail } from '../services/firebase.js';

const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

const handleGoogleSignIn = async () => {
  loading.value = true;
  errorMessage.value = '';

  const res = await loginWithGoogle();
  loading.value = false;

  if (res.success) {
    router.push('/');
  } else {
    errorMessage.value = res.error || 'Authentication failed. Please verify you are using an authorized Koroko administrator account.';
  }
};

const handleEmailSignIn = async () => {
  loading.value = true;
  errorMessage.value = '';

  const res = await loginWithEmail(email.value, password.value);
  loading.value = false;

  if (res.success) {
    router.push('/');
  } else {
    errorMessage.value = res.error || 'Access Denied: Email is not authorized or password is incorrect.';
  }
};
</script>

<style scoped>
.login-page-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 50% 20%, #15151c 0%, #000000 80%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: rgba(18, 18, 23, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  padding: 40px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 1px rgba(255, 255, 255, 0.2);
}

.brand-top {
  text-align: center;
  margin-bottom: 24px;
}
.brand-badge-large {
  width: 52px;
  height: 52px;
  background: #ffffff;
  color: #000000;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 26px;
  border-radius: var(--radius-md);
  margin-bottom: 16px;
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.2);
}
.brand-title {
  font-size: 20px;
  letter-spacing: 0.18em;
  margin-bottom: 6px;
}
.brand-desc {
  font-size: 12px;
  color: var(--text-muted);
}

.security-lock-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.25);
  padding: 8px 12px;
  border-radius: var(--radius-full);
  color: #fde68a;
  font-size: 11px;
  font-family: var(--font-mono-tech);
  margin-bottom: 24px;
}

.auth-buttons-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.google-sign-in-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #ffffff;
  color: #000000;
  padding: 13px 18px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 12.5px;
  letter-spacing: 0.04em;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
}
.google-sign-in-btn:hover:not(:disabled) {
  background: #e4e4e7;
  transform: translateY(-1px);
}
.google-sign-in-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.google-icon {
  width: 18px;
  height: 18px;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0 18px;
  color: var(--text-muted);
  font-size: 10px;
  font-family: var(--font-mono-tech);
  letter-spacing: 0.08em;
}
.divider::before, .divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--border-ultra-subtle);
}
.divider span {
  padding: 0 10px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group label {
  font-size: 11px;
  color: var(--text-secondary);
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.input-wrapper input {
  width: 100%;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  font-size: 13.5px;
  transition: all 0.2s;
  outline: none;
}
.input-wrapper input:focus {
  border-color: #ffffff;
  background: var(--bg-elevated);
}

.error-banner {
  padding: 12px 14px;
  background: rgba(244, 63, 94, 0.12);
  border: 1px solid rgba(244, 63, 94, 0.3);
  color: #fb7185;
  border-radius: var(--radius-sm);
  font-size: 12px;
  line-height: 1.4;
}

.submit-btn {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  color: #ffffff;
  padding: 12px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.06em;
  transition: all 0.2s;
}
.submit-btn:hover:not(:disabled) {
  border-color: #ffffff;
  background: var(--bg-elevated);
}
.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 10.5px;
  color: var(--text-muted);
  letter-spacing: 0.04em;
  line-height: 1.3;
}
</style>
