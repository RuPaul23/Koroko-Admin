<template>
  <div class="dashboard-page">
    <!-- Header Banner -->
    <div class="page-header">
      <div>
        <h1 class="page-title font-display">EXECUTIVE DASHBOARD</h1>
        <p class="page-subtitle">Real-time overview of Koroko brand sales, inventory sync, and Printrove logistics</p>
      </div>
      <div class="header-actions">
        <button class="action-btn-outline font-tech" @click="syncData">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" stroke-width="2"/>
          </svg>
          <span>SYNC CATALOG</span>
        </button>
        <router-link to="/products" class="action-btn-primary font-tech">
          <span>MANAGE STORE CATALOG &rarr;</span>
        </router-link>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-top">
          <span class="metric-label font-tech">TOTAL REVENUE</span>
          <span class="badge badge-emerald">Live</span>
        </div>
        <div class="metric-val font-tech">&#8377;{{ adminStore.metrics.totalRevenue.toLocaleString('en-IN') }}</div>
        <div class="metric-footer font-tech">Razorpay live settlements verified</div>
      </div>

      <div class="metric-card">
        <div class="metric-top">
          <span class="metric-label font-tech">TOTAL ORDERS</span>
          <span class="badge badge-cyan">{{ adminStore.orders.length }} orders</span>
        </div>
        <div class="metric-val font-tech">{{ adminStore.orders.length }}</div>
        <div class="metric-footer font-tech">Live orders synced from store</div>
      </div>

      <div class="metric-card alert-card">
        <div class="metric-top">
          <span class="metric-label font-tech">PENDING FULFILLMENT</span>
          <span class="badge" :class="pendingCount > 0 ? 'badge-amber' : 'badge-emerald'">
            {{ pendingCount > 0 ? 'Requires Action' : 'All Clear' }}
          </span>
        </div>
        <div class="metric-val font-tech">{{ pendingCount }}</div>
        <div class="metric-footer font-tech">Pending approval for vendor dispatch</div>
      </div>

      <div class="metric-card">
        <div class="metric-top">
          <span class="metric-label font-tech">CATALOG DRESSES</span>
          <span class="badge badge-purple">Printrove & Qikink</span>
        </div>
        <div class="metric-val font-tech">{{ adminStore.products.length }}</div>
        <div class="metric-footer font-tech">Products synced from connected vendors</div>
      </div>
    </div>

    <!-- Quick Sections Grid -->
    <div class="dashboard-columns">
      <!-- Recent Orders Stream -->
      <div class="dash-card">
        <div class="dash-card-header">
          <div class="dash-card-title">
            <span class="card-heading font-display">Live Customer Orders</span>
            <span class="card-count">{{ adminStore.orders.length }} recent transactions</span>
          </div>
          <router-link to="/orders" class="view-all-link">View All &rarr;</router-link>
        </div>

        <div class="orders-table-wrapper">
          <table class="luxury-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Item & Shade</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Vendor</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in adminStore.orders.slice(0, 4)" :key="order.id">
                <td class="font-tech text-white font-semibold">{{ order.id }}</td>
                <td>
                  <div class="customer-cell">
                    <span class="c-name">{{ order.customer }}</span>
                    <span class="c-email">{{ order.email }}</span>
                  </div>
                </td>
                <td>
                  <span class="item-summary">{{ order.items[0]?.title }} ({{ order.items[0]?.size }})</span>
                </td>
                <td class="font-tech font-semibold">&#8377;{{ order.total }}</td>
                <td>
                  <span class="badge" :class="getStatusBadgeClass(order.fulfillmentStatus)">
                    {{ order.fulfillmentStatus }}
                  </span>
                </td>
                <td>
                  <span class="vendor-tag">{{ order.vendor }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick POD Health & Studio Status -->
      <div class="dash-card">
        <div class="dash-card-header">
          <div class="dash-card-title">
            <span class="card-heading font-display">POD Vendor Integrations</span>
            <span class="card-count">API status & inventory links</span>
          </div>
          <router-link to="/vendors" class="view-all-link">Manage &rarr;</router-link>
        </div>

        <div class="vendor-list">
          <div v-for="v in adminStore.vendors" :key="v.id" class="vendor-row">
            <div class="vendor-avatar">{{ v.name.slice(0, 2).toUpperCase() }}</div>
            <div class="vendor-info">
              <div class="v-name">{{ v.name }}</div>
              <div class="v-meta font-tech">Merchant #{{ v.merchantId }} • {{ v.lastSync }}</div>
            </div>
            <div class="vendor-status">
              <span class="badge" :class="v.status === 'CONNECTED' || v.status === 'ACTIVE' ? 'badge-emerald' : 'badge-amber'">
                {{ v.status }}
              </span>
            </div>
          </div>
        </div>

        <div class="banner-design-link">
          <div class="banner-info">
            <div class="banner-title font-display">Vendor Apparel Synchronization</div>
            <div class="banner-subtitle">Products and designs are fetched directly from Printrove & Qikink. Review margins, replace artwork, and push to store.</div>
          </div>
          <router-link to="/products" class="banner-btn font-tech">
            VIEW CATALOG ({{ adminStore.products.length }}) &rarr;
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { adminStore } from '../state/store.js';

const pendingCount = computed(() => {
  return adminStore.orders.filter(o => o.fulfillmentStatus === 'PENDING_VENDOR' || o.fulfillmentStatus === 'PROCESSING').length;
});

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'DELIVERED': return 'badge-emerald';
    case 'DISPATCHED': return 'badge-cyan';
    case 'PROCESSING': return 'badge-purple';
    case 'PENDING_VENDOR': return 'badge-amber';
    case 'CANCELLED': return 'badge-rose';
    default: return 'badge-amber';
  }
};

const syncData = () => {
  alert('Syncing live Printrove and Firebase collections for koroko.in...');
};
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn-outline {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  color: var(--text-subtle);
  padding: 10px 16px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}
.action-btn-outline:hover {
  background: var(--bg-elevated);
  border-color: #ffffff;
  color: #ffffff;
}

.action-btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  color: #000000;
  padding: 10px 18px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 700;
  transition: all 0.2s;
}
.action-btn-primary:hover {
  background: #d4d4d8;
  transform: translateY(-1px);
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.metric-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.2s ease;
}
.metric-card:hover {
  border-color: var(--border-medium);
  background: var(--bg-card-hover);
}
.metric-card.alert-card {
  border-left: 3px solid var(--accent-amber);
}

.metric-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.metric-label {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 600;
  letter-spacing: 0.08em;
  font-family: var(--font-mono-tech);
}

.metric-val {
  font-size: 30px;
  font-weight: 700;
  color: #ffffff;
}

.metric-footer {
  font-size: 12px;
  color: var(--text-muted);
}

/* Dashboard Columns */
.dashboard-columns {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;
}

.dash-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dash-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dash-card-title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.card-heading {
  font-size: 16px;
  letter-spacing: 0.05em;
  font-weight: 700;
}
.card-count {
  font-size: 12px;
  color: var(--text-muted);
}

.view-all-link {
  font-size: 12px;
  color: var(--text-subtle);
  font-weight: 600;
}
.view-all-link:hover {
  color: #ffffff;
  text-decoration: underline;
}

/* Luxury Table */
.orders-table-wrapper {
  overflow-x: auto;
}
.luxury-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  text-align: left;
}
.luxury-table th {
  padding: 12px 14px;
  color: var(--text-muted);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 1px solid var(--border-ultra-subtle);
  font-family: var(--font-mono-tech);
}
.luxury-table td {
  padding: 14px;
  border-bottom: 1px solid var(--border-ultra-subtle);
  color: var(--text-secondary);
}
.luxury-table tr:last-child td {
  border-bottom: none;
}
.luxury-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}

.customer-cell {
  display: flex;
  flex-direction: column;
}
.c-name {
  color: var(--text-white);
  font-weight: 600;
}
.c-email {
  font-size: 11px;
  color: var(--text-muted);
}

.item-summary {
  font-size: 12.5px;
  color: var(--text-subtle);
}

.vendor-tag {
  font-family: var(--font-mono-tech);
  font-size: 11.5px;
  color: var(--text-muted);
}

/* Vendor List */
.vendor-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.vendor-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  background: var(--bg-surface);
  border: 1px solid var(--border-ultra-subtle);
  border-radius: var(--radius-sm);
}
.vendor-avatar {
  width: 36px;
  height: 36px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono-tech);
  font-weight: 700;
  font-size: 12px;
}
.vendor-info {
  flex: 1;
}
.v-name {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-white);
}
.v-meta {
  font-size: 11px;
  color: var(--text-muted);
}

.banner-design-link {
  background: linear-gradient(135deg, #181822 0%, #0d0d12 100%);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-sm);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.banner-title {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}
.banner-subtitle {
  font-size: 12px;
  color: var(--text-secondary);
}
.banner-btn {
  background: #ffffff;
  color: #000000;
  text-align: center;
  padding: 10px;
  border-radius: var(--radius-xs);
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.08em;
  transition: all 0.2s;
}
.banner-btn:hover {
  background: #e4e4e7;
}

@media (max-width: 1024px) {
  .dashboard-columns {
    grid-template-columns: 1fr;
  }
}
</style>
