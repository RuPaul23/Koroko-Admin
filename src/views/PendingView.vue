<template>
  <div class="pending-page">
    <div class="page-header">
      <div>
        <h1 class="page-title font-display">PENDING FULFILLMENT QUEUE</h1>
        <p class="page-subtitle">Paid customer orders awaiting Printrove sync, print artwork verification, or dispatch</p>
      </div>

      <div class="batch-actions">
        <button class="batch-btn font-tech" @click="dispatchAllPending" :disabled="pendingOrders.length === 0">
          AUTO-DISPATCH ALL PENDING ({{ pendingOrders.length }}) &rarr;
        </button>
      </div>
    </div>

    <!-- Alert Banner -->
    <div v-if="pendingOrders.length > 0" class="attention-banner">
      <div class="banner-icon">⚠️</div>
      <div class="banner-text">
        <strong>{{ pendingOrders.length }} orders requiring fulfillment.</strong> Customer payments are confirmed by Razorpay. Click "Push to Printrove" or resolve print files to start production.
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state-box">
      <div class="empty-icon">✓</div>
      <h3 class="font-display">All Orders Fulfilled</h3>
      <p>There are zero pending orders in the queue. All customer items have been dispatched to vendors.</p>
      <router-link to="/orders" class="empty-link font-tech">VIEW ALL ORDERS &rarr;</router-link>
    </div>

    <!-- Pending Cards Grid -->
    <div v-if="pendingOrders.length > 0" class="pending-grid">
      <div v-for="order in pendingOrders" :key="order.id" class="pending-card">
        <div class="card-top">
          <div class="order-ref">
            <span class="font-tech font-bold text-white">{{ order.id }}</span>
            <span class="order-time font-tech">{{ order.date }}</span>
          </div>
          <span class="badge badge-amber">{{ order.fulfillmentStatus }}</span>
        </div>

        <div class="customer-row">
          <div class="avatar-sq">{{ order.customer.slice(0, 1) }}</div>
          <div class="c-details">
            <div class="name">{{ order.customer }}</div>
            <div class="phone font-tech">{{ order.phone }}</div>
            <div class="address">{{ order.shippingAddress }}</div>
          </div>
        </div>

        <div class="items-summary-box">
          <div class="section-title font-tech">ORDER CONTENTS (100% COTTON)</div>
          <div v-for="(item, i) in order.items" :key="i" class="item-line">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-variant font-tech">Size: {{ item.size }} • Qty: {{ item.qty }} • &#8377;{{ item.price }}</div>
          </div>
        </div>

        <div class="actions-footer">
          <div class="total-col">
            <span class="total-label font-tech">TOTAL PAID</span>
            <span class="total-val font-tech">&#8377;{{ order.total }}</span>
          </div>
          <div class="btn-group">
            <button class="hold-btn" @click="cancelOrder(order)">Cancel / Refund</button>
            <button class="dispatch-action-btn font-tech" @click="dispatchOrder(order)">
              PUSH TO PRINTROVE &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { adminStore } from '../state/store.js';

const pendingOrders = computed(() => {
  return adminStore.orders.filter(o => 
    o.fulfillmentStatus === 'PENDING_VENDOR' || o.fulfillmentStatus === 'PROCESSING'
  );
});

const dispatchOrder = (order) => {
  order.fulfillmentStatus = 'DISPATCHED';
  order.vendorOrderId = 'PR-' + Math.floor(100000 + Math.random() * 900000);
  alert(`Order ${order.id} released to Printrove logistics! Assigned Tracking ID: ${order.vendorOrderId}`);
};

const dispatchAllPending = () => {
  if (confirm(`Push all ${pendingOrders.value.length} pending orders to Printrove API?`)) {
    pendingOrders.value.forEach(order => {
      order.fulfillmentStatus = 'DISPATCHED';
      order.vendorOrderId = 'PR-' + Math.floor(100000 + Math.random() * 900000);
    });
    alert('All orders have been successfully dispatched to Printrove fulfillment center.');
  }
};

const cancelOrder = (order) => {
  if (confirm(`Cancel and mark Order ${order.id} for refund?`)) {
    order.fulfillmentStatus = 'CANCELLED';
    order.paymentStatus = 'REFUNDED';
  }
};
</script>

<style scoped>
.pending-page {
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

.batch-btn {
  background: #ffffff;
  color: #000000;
  font-weight: 700;
  font-size: 12px;
  padding: 10px 18px;
  border-radius: var(--radius-sm);
  letter-spacing: 0.05em;
  transition: all 0.2s;
}
.batch-btn:hover:not(:disabled) {
  background: #e4e4e7;
  transform: translateY(-1px);
}
.batch-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.attention-banner {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 14px 18px;
  border-radius: var(--radius-sm);
  color: #fde68a;
  font-size: 13px;
}
.banner-icon {
  font-size: 18px;
}

.empty-state-box {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 60px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.empty-icon {
  width: 50px;
  height: 50px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #34d399;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 6px;
}
.empty-state-box h3 {
  font-size: 18px;
  letter-spacing: 0.08em;
}
.empty-state-box p {
  color: var(--text-muted);
  font-size: 13px;
  max-width: 440px;
}
.empty-link {
  margin-top: 10px;
  font-size: 12px;
  color: #ffffff;
  border-bottom: 1px solid #ffffff;
}

/* Grid */
.pending-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

.pending-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.2s;
}
.pending-card:hover {
  border-color: var(--border-medium);
  background: var(--bg-card-hover);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.order-ref {
  display: flex;
  align-items: center;
  gap: 10px;
}
.order-time {
  font-size: 11px;
  color: var(--text-muted);
}

.customer-row {
  display: flex;
  gap: 12px;
  background: var(--bg-surface);
  padding: 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-ultra-subtle);
}
.avatar-sq {
  width: 36px;
  height: 36px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}
.c-details {
  flex: 1;
  font-size: 12.5px;
}
.c-details .name {
  color: #ffffff;
  font-weight: 600;
}
.c-details .phone {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 3px;
}
.c-details .address {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.3;
}

.items-summary-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.section-title {
  font-size: 10px;
  color: var(--text-muted);
  letter-spacing: 0.08em;
}
.item-line {
  background: var(--bg-surface);
  padding: 8px 10px;
  border-radius: var(--radius-xs);
}
.item-title {
  font-size: 12.5px;
  font-weight: 500;
  color: #ffffff;
}
.item-variant {
  font-size: 11px;
  color: var(--text-muted);
}

.actions-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border-ultra-subtle);
  padding-top: 14px;
  margin-top: auto;
}
.total-col {
  display: flex;
  flex-direction: column;
}
.total-label {
  font-size: 10px;
  color: var(--text-muted);
}
.total-val {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
}

.btn-group {
  display: flex;
  gap: 8px;
}
.hold-btn {
  font-size: 11px;
  color: var(--text-muted);
  padding: 6px 10px;
  border-radius: var(--radius-xs);
  transition: color 0.2s;
}
.hold-btn:hover {
  color: var(--accent-rose);
}
.dispatch-action-btn {
  background: #ffffff;
  color: #000000;
  font-size: 11px;
  font-weight: 700;
  padding: 8px 14px;
  border-radius: var(--radius-xs);
  letter-spacing: 0.05em;
  transition: all 0.2s;
}
.dispatch-action-btn:hover {
  background: #e4e4e7;
}
</style>
