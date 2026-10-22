<template>
  <div class="login-page-wrapper">
    <div class="login-card">
      <div class="brand-top">
        <div class="brand-badge-large">K</div>
        <h1 class="brand-title font-display">KOROKO ADMIN</h1>
        <p class="brand-desc">Master Operations Control Portal • admin.koroko.in</p>
      </div>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label>Admin Email</label>
          <div class="input-wrapper">
            <input 
              v-model="email" 
              type="email" 
              placeholder="director@koroko.in" 
              required 
            />
          </div>
        </div>

        <div class="form-group">
          <label>Secret Passcode / Master Key</label>
          <div class="input-wrapper">
            <input 
              v-model="password" 
              type="password" 
              placeholder="••••••••••••" 
              required 
            />
          </div>
          <span class="hint-text">Use your Firebase Admin credentials or local admin pass key.</span>
        </div>

        <div v-if="errorMessage" class="error-banner">
          {{ errorMessage }}
        </div>

        <button type="submit" class="submit-btn font-tech" :disabled="loading">
          <span v-if="!loading">AUTHENTICATE & ENTER PORTAL &rarr;</span>
          <span v-else>VERIFYING CREDENTIALS...</span>
        </button>

        <div class="quick-pass-box">
          <p class="quick-title">Developer Direct Access</p>
          <button type="button" @click="handleBypass" class="bypass-btn">
            Quick Sign-In with Master Key (director@koroko.in)
          </button>
        </div>
      </form>

      <div class="login-footer">
        <span>Protected by Koroko Multi-Subdomain Zero Trust Security</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginWithCredentials } from '../services/firebase.js';

const router = useRouter();

const email = ref('director@koroko.in');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

const handleSubmit = async () => {
  loading.value = true;
  errorMessage.value = '';

  const res = await loginWithCredentials(email.value, password.value);
  loading.value = false;

  if (res.success) {
    router.push('/');
  } else {
    errorMessage.value = res.error || 'Invalid credentials or security key. Please check again.';
  }
};

const handleBypass = async () => {
  loading.value = true;
  const res = await loginWithCredentials('director@koroko.in', 'koroko2026');
  loading.value = false;
  if (res.success) {
    router.push('/');
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
  background: rgba(18, 18, 23, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  padding: 40px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 1px rgba(255, 255, 255, 0.2);
}

.brand-top {
  text-align: center;
  margin-bottom: 32px;
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

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group label {
  font-size: 12px;
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
  font-size: 14px;
  transition: all 0.2s;
  outline: none;
}
.input-wrapper input:focus {
  border-color: #ffffff;
  background: var(--bg-elevated);
}

.hint-text {
  font-size: 11px;
  color: var(--text-muted);
}

.error-banner {
  padding: 10px 14px;
  background: rgba(244, 63, 94, 0.12);
  border: 1px solid rgba(244, 63, 94, 0.3);
  color: #fb7185;
  border-radius: var(--radius-sm);
  font-size: 12px;
}

.submit-btn {
  background: #ffffff;
  color: #000000;
  padding: 14px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.08em;
  transition: all 0.2s;
  margin-top: 6px;
}
.submit-btn:hover:not(:disabled) {
  background: #e4e4e7;
  transform: translateY(-1px);
}
.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quick-pass-box {
  border-top: 1px solid var(--border-ultra-subtle);
  padding-top: 18px;
  margin-top: 8px;
  text-align: center;
}
.quick-title {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 8px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.bypass-btn {
  font-size: 12px;
  color: var(--text-subtle);
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
  width: 100%;
}
.bypass-btn:hover {
  border-color: #ffffff;
  background: var(--bg-elevated);
  color: #ffffff;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 10.5px;
  color: var(--text-muted);
  letter-spacing: 0.04em;
}
</style>
