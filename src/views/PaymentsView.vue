<template>
  <div class="payments-page">
    <div class="page-header">
      <div>
        <h1 class="page-title font-display">PAYMENTS & RAZORPAY SETTLEMENTS</h1>
        <p class="page-subtitle">Inspect live Razorpay gateway transactions, UPI captures, payment webhook events, and instant refunds</p>
      </div>

      <div class="gateway-badge">
        <span class="live-dot"></span>
        <span>Razorpay Live Merchant: rzp_live_Tq69vbLQwn4hq9</span>
      </div>
    </div>

    <!-- Settlement Overview -->
    <div class="settlement-strip">
      <div class="strip-item">
        <span class="strip-label font-tech">NET CAPTURED TODAY</span>
        <span class="strip-val font-tech">&#8377;18,480</span>
        <span class="strip-sub">Auto-settling to HDFC Primary Account</span>
      </div>
      <div class="strip-item">
        <span class="strip-label font-tech">GATEWAY SUCCESS RATE</span>
        <span class="strip-val font-tech text-emerald">99.2%</span>
        <span class="strip-sub">Zero downtime across UPI / Cards</span>
      </div>
      <div class="strip-item">
        <span class="strip-label font-tech">AVERAGE ORDER VALUE (AOV)</span>
        <span class="strip-val font-tech">&#8377;1,890</span>
        <span class="strip-sub">+12% vs last month</span>
      </div>
      <div class="strip-item">
        <span class="strip-label font-tech">REFUND RESERVE</span>
        <span class="strip-val font-tech text-muted">&#8377;1,599</span>
        <span class="strip-sub">1 processed return</span>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="payments-card">
      <div class="card-header">
        <h3 class="font-display">Live Payment Transactions</h3>
        <span class="sub-counter font-tech">{{ transactions.length }} captured webhooks</span>
      </div>

      <div class="table-wrapper">
        <table class="luxury-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Customer</th>
              <th>Order ID</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in transactions" :key="tx.id">
              <td class="font-tech text-white font-semibold">
                <span class="pay-id">{{ tx.id }}</span>
              </td>
              <td>
                <div class="cust-info">
                  <span class="name">{{ tx.customer }}</span>
                  <span class="vpa font-tech">{{ tx.vpa }}</span>
                </div>
              </td>
              <td class="font-tech">{{ tx.orderId }}</td>
              <td>
                <span class="method-tag font-tech">{{ tx.method }}</span>
              </td>
              <td class="font-tech font-bold text-white">&#8377;{{ tx.amount }}</td>
              <td>
                <span class="badge" :class="tx.status === 'captured' ? 'badge-emerald' : 'badge-rose'">
                  {{ tx.status.toUpperCase() }}
                </span>
              </td>
              <td>
                <button 
                  v-if="tx.status === 'captured'" 
                  class="refund-btn font-tech"
                  @click="initiateRefund(tx)"
                >
                  REFUND &rarr;
                </button>
                <span v-else class="refunded-label font-tech">REFUNDED</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const transactions = ref([
  {
    id: 'pay_P98fXka99qA',
    customer: 'Aarav Sharma',
    vpa: 'aarav@okaxis',
    orderId: 'ORD-8941',
    method: 'UPI (GPay)',
    amount: 1499,
    status: 'captured'
  },
  {
    id: 'pay_P97aNm110Bx',
    customer: 'Priya Iyer',
    vpa: 'HDFC Netbanking',
    orderId: 'ORD-8940',
    method: 'Netbanking',
    amount: 2598,
    status: 'captured'
  },
  {
    id: 'pay_P95kLk887Pz',
    customer: 'Kabir Verma',
    vpa: 'kabir@paytm',
    orderId: 'ORD-8939',
    method: 'UPI (Paytm)',
    amount: 2899,
    status: 'captured'
  },
  {
    id: 'pay_P94xQw665Kl',
    customer: 'Neha Singhania',
    vpa: 'neha@icici',
    orderId: 'ORD-8938',
    method: 'UPI (PhonePe)',
    amount: 1399,
    status: 'captured'
  },
  {
    id: 'pay_P93jHg443Op',
    customer: 'Rohan Mehta',
    vpa: '•••• 4920 (Mastercard)',
    orderId: 'ORD-8937',
    method: 'Credit Card',
    amount: 1599,
    status: 'refunded'
  }
]);

const initiateRefund = (tx) => {
  if (confirm(`Process instant full refund of ₹${tx.amount} to ${tx.customer} via Razorpay?`)) {
    tx.status = 'refunded';
    alert(`Refund processed! Razorpay Refund ID: rfn_${Math.random().toString(36).substring(7)}`);
  }
};
</script>

<style scoped>
.payments-page {
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

.gateway-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  font-family: var(--font-mono-tech);
  color: #34d399;
  background: rgba(16, 185, 129, 0.1);
  padding: 8px 14px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(16, 185, 129, 0.25);
}
.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 8px #34d399;
}

/* Strip */
.settlement-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
.strip-item {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.strip-label {
  font-size: 10px;
  color: var(--text-muted);
  letter-spacing: 0.08em;
}
.strip-val {
  font-size: 26px;
  font-weight: 700;
  color: #ffffff;
}
.strip-sub {
  font-size: 11.5px;
  color: var(--text-muted);
}
.text-emerald {
  color: #34d399;
}

/* Card */
.payments-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-header h3 {
  font-size: 16px;
  letter-spacing: 0.04em;
}
.sub-counter {
  font-size: 11px;
  color: var(--text-muted);
}

.table-wrapper {
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

.pay-id {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  padding: 4px 8px;
  border-radius: var(--radius-xs);
  font-size: 11px;
}

.cust-info {
  display: flex;
  flex-direction: column;
}
.cust-info .name {
  color: #ffffff;
  font-weight: 600;
}
.cust-info .vpa {
  font-size: 11px;
  color: var(--text-muted);
}

.method-tag {
  font-size: 11px;
  color: var(--text-subtle);
  background: var(--bg-surface);
  padding: 3px 8px;
  border-radius: var(--radius-xs);
  border: 1px solid var(--border-ultra-subtle);
}

.refund-btn {
  font-size: 11px;
  color: var(--accent-rose);
  border: 1px solid rgba(244, 63, 94, 0.3);
  padding: 5px 10px;
  border-radius: var(--radius-xs);
  transition: all 0.2s;
}
.refund-btn:hover {
  background: rgba(244, 63, 94, 0.1);
}

.refunded-label {
  font-size: 11px;
  color: var(--text-muted);
}
</style>
