<template>
  <div class="orders-page">
    <div class="page-header">
      <div>
        <h1 class="page-title font-display">ORDERS MANAGEMENT</h1>
      </div>

      <div class="header-filters">
        <div class="filter-pills">
          <button 
            v-for="filter in ['ALL', 'PAID', 'PENDING_VENDOR', 'PROCESSING', 'DISPATCHED', 'DELIVERED']" 
            :key="filter"
            class="pill-btn font-tech"
            :class="{ active: activeFilter === filter }"
            @click="activeFilter = filter"
          >
            {{ filter.replace('_', ' ') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Orders Table Container -->
    <div class="orders-card">
      <div class="orders-search-bar">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8" stroke-width="2"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65" stroke-width="2"/>
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Filter by Customer Name, Order ID, City, or Phone..." />
      </div>

      <div class="table-container">
        <table class="luxury-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer & Shipping</th>
              <th>Date / Time</th>
              <th>Items & Sizes</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Vendor Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id">
              <td class="font-tech font-bold text-white">
                <span class="order-id-badge">{{ order.id }}</span>
              </td>
              <td>
                <div class="customer-info-box">
                  <span class="c-name">{{ order.customer }}</span>
                  <span class="c-phone font-tech">{{ order.phone }}</span>
                  <span class="c-address">{{ order.shippingAddress }}</span>
                </div>
              </td>
              <td class="font-tech font-xs text-muted">
                {{ order.date }}
              </td>
              <td>
                <div class="order-items-list">
                  <div v-for="(it, idx) in order.items" :key="idx" class="item-tag">
                    <span class="item-name">{{ it.title }}</span>
                    <span class="item-meta font-tech">Qty: {{ it.qty }} • Size: {{ it.size }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="payment-info-box">
                  <span class="pay-amount font-tech">&#8377;{{ order.total }}</span>
                  <span class="badge" :class="order.paymentStatus === 'PAID' ? 'badge-emerald' : 'badge-rose'">
                    {{ order.paymentStatus }}
                  </span>
                  <span class="pay-method font-tech">{{ order.paymentMethod }}</span>
                </div>
              </td>
              <td>
                <select 
                  v-model="order.fulfillmentStatus" 
                  class="status-dropdown font-tech"
                  :class="getStatusDropdownClass(order.fulfillmentStatus)"
                >
                  <option value="PENDING_VENDOR">PENDING VENDOR</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="DISPATCHED">DISPATCHED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </td>
              <td>
                <button 
                  v-if="order.fulfillmentStatus === 'PENDING_VENDOR'" 
                  class="dispatch-btn font-tech"
                  @click="dispatchToVendor(order)"
                >
                  PUSH TO PRINTROVE
                </button>
                <div v-else class="synced-meta font-tech">
                  <span>{{ order.vendor }}: {{ order.vendorOrderId || 'Synced' }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { adminStore } from '../state/store.js';

const activeFilter = ref('ALL');
const searchQuery = ref('');

const filteredOrders = computed(() => {
  return adminStore.orders.filter(order => {
    // Status Filter
    const matchesFilter = activeFilter.value === 'ALL' || 
      order.fulfillmentStatus === activeFilter.value || 
      order.paymentStatus === activeFilter.value;

    // Search Query
    const q = searchQuery.value.toLowerCase().trim();
    if (!q) return matchesFilter;

    const matchesSearch = 
      order.id.toLowerCase().includes(q) ||
      order.customer.toLowerCase().includes(q) ||
      order.email.toLowerCase().includes(q) ||
      order.shippingAddress.toLowerCase().includes(q) ||
      order.phone.includes(q);

    return matchesFilter && matchesSearch;
  });
});

const getStatusDropdownClass = (status) => {
  switch (status) {
    case 'DELIVERED': return 'badge-emerald';
    case 'DISPATCHED': return 'badge-cyan';
    case 'PROCESSING': return 'badge-purple';
    case 'PENDING_VENDOR': return 'badge-amber';
    case 'CANCELLED': return 'badge-rose';
    default: return 'badge-amber';
  }
};

const dispatchToVendor = (order) => {
  order.fulfillmentStatus = 'PROCESSING';
  order.vendorOrderId = 'PR-' + Math.floor(100000 + Math.random() * 900000);
  alert(`Order ${order.id} pushed to Printrove Merchant API successfully! (Vendor ID: ${order.vendorOrderId})`);
};
</script>

<style scoped>
.orders-page {
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

.filter-pills {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.pill-btn {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  transition: all 0.2s;
}
.pill-btn:hover {
  background: var(--bg-elevated);
  color: #ffffff;
}
.pill-btn.active {
  background: #ffffff;
  color: #000000;
  border-color: #ffffff;
}

.orders-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.orders-search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 10px 16px;
}
.orders-search-bar input {
  background: transparent;
  border: none;
  outline: none;
  font-size: 13px;
  width: 100%;
}
.orders-search-bar svg {
  color: var(--text-muted);
}

.table-container {
  overflow-x: auto;
}

.luxury-table {
  width: 100%;
  min-width: 860px;
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
  vertical-align: top;
}
.luxury-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}

.order-id-badge {
  padding: 4px 8px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xs);
  font-size: 12px;
}

.customer-info-box {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-width: 240px;
}
.c-name {
  color: #ffffff;
  font-weight: 600;
}
.c-phone {
  font-size: 11px;
  color: var(--text-muted);
}
.c-address {
  font-size: 11.5px;
  color: var(--text-muted);
  line-height: 1.3;
}

.order-items-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 220px;
}
.item-tag {
  display: flex;
  flex-direction: column;
  background: var(--bg-surface);
  padding: 6px 8px;
  border-radius: var(--radius-xs);
  border: 1px solid var(--border-ultra-subtle);
}
.item-name {
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
}
.item-meta {
  font-size: 10.5px;
  color: var(--text-muted);
}

.payment-info-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.pay-amount {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
}
.pay-method {
  font-size: 10.5px;
  color: var(--text-muted);
}

.status-dropdown {
  padding: 5px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  outline: none;
}

.dispatch-btn {
  background: #ffffff;
  color: #000000;
  font-size: 11px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: var(--radius-xs);
  transition: all 0.2s;
  letter-spacing: 0.05em;
  white-space: nowrap;
}
.dispatch-btn:hover {
  background: #d4d4d8;
}

.synced-meta {
  font-size: 11px;
  color: #34d399;
}
</style>
