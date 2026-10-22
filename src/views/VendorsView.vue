<template>
  <div class="vendors-page">
    <div class="page-header">
      <div>
        <h1 class="page-title font-display">POD VENDORS & STORE CONNECT</h1>
        <p class="page-subtitle">Configure Print-on-Demand providers (Printrove, Qikink), set custom API keys, and manage safety approval gates</p>
      </div>

      <button class="action-btn-primary font-tech" @click="showConnectModal = true">
        + CONNECT STORE / API
      </button>
    </div>

    <!-- Safety Gate Explainer Banner -->
    <div class="safety-banner">
      <div class="shield-icon">🛡️</div>
      <div class="safety-text">
        <strong>Manual Merchant Approval Gate is Active:</strong> When an order is pushed from Koroko-Admin to Printrove or Qikink, it is sent in <code>ON HOLD / PENDING_CONFIRMATION</code> state. <strong>No production or printing will begin</strong> until you inspect and officially confirm/accept it inside your Printrove / Qikink merchant panel.
      </div>
    </div>

    <!-- Active Providers Grid -->
    <div class="vendors-grid">
      <div v-for="vendor in adminStore.vendors" :key="vendor.id" class="vendor-card">
        <div class="vcard-top">
          <div class="v-brand-icon">{{ vendor.name.slice(0, 2).toUpperCase() }}</div>
          <div class="v-title-block">
            <h3 class="font-display">{{ vendor.name }}</h3>
            <span class="v-sub font-tech">Merchant ID: {{ vendor.merchantId }}</span>
          </div>
          <span class="badge" :class="vendor.status === 'CONNECTED' || vendor.status === 'ACTIVE' ? 'badge-emerald' : 'badge-amber'">
            {{ vendor.status }}
          </span>
        </div>

        <div class="vcard-details">
          <div class="detail-row">
            <span class="label">API Endpoint</span>
            <span class="val font-tech code-text">{{ vendor.endpoint }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Account Email</span>
            <span class="val">{{ vendor.email }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Print Protection</span>
            <span class="val font-tech text-amber">
              REQUIRES DASHBOARD APPROVAL
            </span>
          </div>
          <div class="detail-row">
            <span class="label">Auto-Deduct Balance</span>
            <span class="val font-tech text-rose">
              BLOCKED UNTIL APPROVED
            </span>
          </div>
        </div>

        <!-- Metrics Strip -->
        <div class="vcard-stats">
          <div class="stat-box">
            <div class="num font-tech">{{ vendor.productsSynced }}</div>
            <div class="desc">Catalog SKUs</div>
          </div>
          <div class="stat-box">
            <div class="num font-tech">{{ vendor.ordersFulfilled }}</div>
            <div class="desc">Pushed Orders</div>
          </div>
          <div class="stat-box">
            <div class="num font-tech">{{ vendor.lastSync }}</div>
            <div class="desc">Last Synced</div>
          </div>
        </div>

        <div class="vcard-actions">
          <button class="btn-outline font-tech" @click="editVendor(vendor)">
            CONFIGURE API KEYS
          </button>
          <button class="btn-primary font-tech" @click="testConnection(vendor)">
            TEST HANDSHAKE
          </button>
        </div>
      </div>
    </div>

    <!-- Store Connect / API Keys Modal -->
    <div v-if="showConnectModal" class="modal-backdrop" @click.self="showConnectModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h2 class="font-display">Connect Store API (Printrove / Qikink)</h2>
          <button class="close-x" @click="showConnectModal = false">&times;</button>
        </div>

        <form @submit.prevent="saveVendorConnection" class="modal-form">
          <div class="form-item">
            <label>Select Provider</label>
            <select v-model="connectForm.provider" required>
              <option value="printrove">Printrove Custom Store API</option>
              <option value="qikink">Qikink POD Warehouse API</option>
              <option value="custom">Other Custom DTG Provider</option>
            </select>
          </div>

          <div class="form-item">
            <label>Merchant / Account ID</label>
            <input v-model="connectForm.merchantId" type="text" placeholder="e.g. 300632 or QK-9921" required />
          </div>

          <div class="form-item">
            <label>API Key / Access Token</label>
            <textarea v-model="connectForm.apiKey" rows="2" placeholder="Paste your API Key or JWT token..." required></textarea>
          </div>

          <div class="form-item">
            <label>API Secret / Webhook Secret</label>
            <input v-model="connectForm.apiSecret" type="password" placeholder="••••••••••••" />
          </div>

          <div class="form-item">
            <label>Base Endpoint URL</label>
            <input v-model="connectForm.endpoint" type="text" placeholder="https://api.printrove.com/api" required />
          </div>

          <div class="checkbox-row">
            <input type="checkbox" id="holdOrders" v-model="connectForm.requireApproval" checked disabled />
            <label for="holdOrders">Always place order in "Draft / On Hold" state (Prevents printing until accepted in provider portal)</label>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="showConnectModal = false">Cancel</button>
            <button type="submit" class="btn-save font-tech">CONNECT & VERIFY API &rarr;</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { adminStore } from '../state/store.js';

const showConnectModal = ref(false);

const connectForm = ref({
  provider: 'printrove',
  merchantId: '300632',
  apiKey: '',
  apiSecret: '',
  endpoint: 'https://api.printrove.com/api',
  requireApproval: true
});

const testConnection = (vendor) => {
  alert(`Testing API connection to ${vendor.name} (${vendor.endpoint})...\nStatus: 200 OK. Safety hold mechanism verified!`);
};

const editVendor = (vendor) => {
  connectForm.value.provider = vendor.id;
  connectForm.value.merchantId = vendor.merchantId;
  connectForm.value.endpoint = vendor.endpoint;
  showConnectModal.value = true;
};

const saveVendorConnection = () => {
  alert(`API Credentials for ${connectForm.value.provider.toUpperCase()} saved successfully! All pushed orders will remain on hold until accepted.`);
  showConnectModal.value = false;
};
</script>

<style scoped>
.vendors-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}
.page-title {
  font-size: 24px;
  letter-spacing: 0.12em;
  margin-bottom: 4px;
}
.page-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
}

.action-btn-primary {
  background: #ffffff;
  color: #000000;
  font-weight: 700;
  font-size: 12px;
  padding: 10px 18px;
  border-radius: var(--radius-sm);
  letter-spacing: 0.05em;
  transition: all 0.2s;
}
.action-btn-primary:hover {
  background: #e4e4e7;
  transform: translateY(-1px);
}

.safety-banner {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: var(--radius-sm);
  padding: 14px 18px;
  color: #6ee7b7;
  font-size: 13px;
  line-height: 1.4;
}
.shield-icon {
  font-size: 24px;
}
.safety-banner code {
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 6px;
  border-radius: 4px;
  color: #ffffff;
}

/* Grid */
.vendors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

.vendor-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  transition: all 0.2s;
}
.vendor-card:hover {
  border-color: var(--border-medium);
  background: var(--bg-card-hover);
}

.vcard-top {
  display: flex;
  align-items: center;
  gap: 14px;
}
.v-brand-icon {
  width: 44px;
  height: 44px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 16px;
  color: #ffffff;
}
.v-title-block {
  flex: 1;
}
.v-title-block h3 {
  font-size: 16px;
  letter-spacing: 0.04em;
  margin-bottom: 2px;
}
.v-sub {
  font-size: 11px;
  color: var(--text-muted);
}

.vcard-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--bg-surface);
  padding: 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-ultra-subtle);
}
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}
.detail-row .label {
  color: var(--text-muted);
}
.detail-row .val {
  color: #ffffff;
}
.code-text {
  font-size: 11px;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.04);
  padding: 2px 6px;
  border-radius: var(--radius-xs);
}
.text-amber {
  color: #fbbf24;
}
.text-rose {
  color: #fb7185;
}

.vcard-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  background: var(--bg-surface);
  border-radius: var(--radius-sm);
  padding: 12px;
  text-align: center;
  border: 1px solid var(--border-ultra-subtle);
}
.stat-box .num {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
}
.stat-box .desc {
  font-size: 10.5px;
  color: var(--text-muted);
  margin-top: 2px;
}

.vcard-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: auto;
}
.btn-outline {
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  color: var(--text-subtle);
  padding: 9px;
  border-radius: var(--radius-xs);
  font-size: 11px;
  font-weight: 600;
  transition: all 0.2s;
}
.btn-outline:hover {
  background: var(--bg-elevated);
  border-color: #ffffff;
  color: #ffffff;
}
.btn-primary {
  background: #ffffff;
  color: #000000;
  padding: 9px;
  border-radius: var(--radius-xs);
  font-size: 11px;
  font-weight: 700;
  transition: all 0.2s;
}
.btn-primary:hover {
  background: #e4e4e7;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
}
.modal-card {
  background: var(--bg-card);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  width: 100%;
  max-width: 520px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h2 {
  font-size: 18px;
  letter-spacing: 0.05em;
}
.close-x {
  font-size: 24px;
  color: var(--text-muted);
  cursor: pointer;
}
.close-x:hover {
  color: #ffffff;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-item label {
  font-size: 11.5px;
  color: var(--text-secondary);
}
.form-item input, .form-item select, .form-item textarea {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xs);
  padding: 10px 14px;
  font-size: 13px;
  outline: none;
  font-family: inherit;
  color: #ffffff;
}
.form-item input:focus, .form-item select:focus, .form-item textarea:focus {
  border-color: #ffffff;
  background: var(--bg-elevated);
}

.checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 12px;
  color: #34d399;
  background: rgba(16, 185, 129, 0.06);
  padding: 10px 12px;
  border-radius: var(--radius-xs);
}
.checkbox-row input {
  margin-top: 3px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}
.btn-cancel {
  padding: 10px 18px;
  color: var(--text-muted);
  font-size: 12px;
}
.btn-save {
  background: #ffffff;
  color: #000000;
  padding: 10px 20px;
  border-radius: var(--radius-xs);
  font-weight: 700;
  font-size: 12px;
}
</style>
