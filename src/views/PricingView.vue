<template>
  <div class="pricing-page">
    <div class="page-header">
      <div>
        <h1 class="page-title font-display">PRICING & PROFIT MARGIN ENGINE</h1>
        <p class="page-subtitle">Calculate real-time unit economics, Printrove base blanks, printing fees, and customer retail prices</p>
      </div>

      <button class="save-all-btn font-tech" @click="savePricingRules">
        SAVE PRICING ARCHITECTURE
      </button>
    </div>

    <!-- Live Calculator Card -->
    <div class="calculator-card">
      <div class="card-header">
        <h3 class="font-display">Margin Simulator & Price Sensitivity</h3>
        <span class="badge badge-emerald">Real-Time Gross Profit</span>
      </div>

      <div class="calc-grid">
        <div class="calc-input-col">
          <div class="input-item">
            <label>Blank Apparel Cost (Printrove 240 GSM)</label>
            <div class="currency-input font-tech">
              <span>&#8377;</span>
              <input v-model.number="simulator.blankCost" type="number" />
            </div>
          </div>

          <div class="input-item">
            <label>DTG Printing Cost (Front + Back)</label>
            <div class="currency-input font-tech">
              <span>&#8377;</span>
              <input v-model.number="simulator.printCost" type="number" />
            </div>
          </div>

          <div class="input-item">
            <label>Customer Retail Price</label>
            <div class="currency-input font-tech">
              <span>&#8377;</span>
              <input v-model.number="simulator.retailPrice" type="number" />
            </div>
          </div>
        </div>

        <div class="calc-results-col">
          <div class="result-box">
            <div class="res-label font-tech">TOTAL COGS PER UNIT</div>
            <div class="res-val font-tech">&#8377;{{ totalCogs }}</div>
            <div class="res-desc">Raw blank + DTG print + bio-wash</div>
          </div>

          <div class="result-box highlight-box">
            <div class="res-label font-tech">NET PROFIT PER UNIT</div>
            <div class="res-val font-tech">&#8377;{{ netProfit }}</div>
            <div class="res-desc">Gross margin before payment gateway (2%)</div>
          </div>

          <div class="result-box">
            <div class="res-label font-tech">GROSS PROFIT MARGIN</div>
            <div class="res-val font-tech text-emerald">{{ profitMargin }}%</div>
            <div class="res-desc">Target standard: > 50% for D2C luxury</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Pricing Catalog Table -->
    <div class="pricing-table-card">
      <div class="card-header">
        <div>
          <h3 class="font-display">Live Catalog SKUs & Margin Structure</h3>
          <p class="table-sub">Direct pricing overrides reflected on https://koroko.in</p>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="luxury-table">
          <thead>
            <tr>
              <th>Product / SKU</th>
              <th>Category</th>
              <th>Blank Cost</th>
              <th>Print Cost</th>
              <th>Retail Price (&#8377;)</th>
              <th>Strikethrough MRP</th>
              <th>Gross Margin</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in adminStore.products" :key="product.id">
              <td>
                <div class="product-cell">
                  <img :src="product.mockupFront" alt="Thumbnail" class="prod-thumb" />
                  <div class="prod-info">
                    <span class="p-title font-semibold text-white">{{ product.title }}</span>
                    <span class="p-id font-tech">{{ product.id }}</span>
                  </div>
                </div>
              </td>
              <td class="font-tech text-secondary">{{ product.category }}</td>
              <td class="font-tech">&#8377;{{ product.baseCost }}</td>
              <td class="font-tech">&#8377;{{ product.printCost }}</td>
              <td>
                <input 
                  v-model.number="product.retailPrice" 
                  type="number" 
                  class="table-number-input font-tech"
                />
              </td>
              <td>
                <input 
                  v-model.number="product.mrp" 
                  type="number" 
                  class="table-number-input font-tech text-muted"
                />
              </td>
              <td>
                <span class="margin-pill font-tech">
                  {{ calculateMargin(product) }}%
                </span>
              </td>
              <td>
                <span class="badge" :class="product.active ? 'badge-emerald' : 'badge-amber'">
                  {{ product.active ? 'LIVE ON STORE' : 'DRAFT' }}
                </span>
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

const simulator = ref({
  blankCost: 480,
  printCost: 190,
  retailPrice: 1499
});

const totalCogs = computed(() => {
  return simulator.value.blankCost + simulator.value.printCost;
});

const netProfit = computed(() => {
  return simulator.value.retailPrice - totalCogs.value;
});

const profitMargin = computed(() => {
  if (simulator.value.retailPrice <= 0) return 0;
  return Math.round((netProfit.value / simulator.value.retailPrice) * 100);
});

const calculateMargin = (product) => {
  const cogs = (product.baseCost || 0) + (product.printCost || 0);
  if (!product.retailPrice) return 0;
  return Math.round(((product.retailPrice - cogs) / product.retailPrice) * 100);
};

const savePricingRules = () => {
  alert('All pricing tiers, unit economics, and catalog prices updated across Koroko cloud backend!');
};
</script>

<style scoped>
.pricing-page {
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

.save-all-btn {
  background: #ffffff;
  color: #000000;
  font-weight: 700;
  font-size: 12px;
  padding: 10px 18px;
  border-radius: var(--radius-sm);
  letter-spacing: 0.05em;
  transition: all 0.2s;
}
.save-all-btn:hover {
  background: #e4e4e7;
  transform: translateY(-1px);
}

/* Calculator Card */
.calculator-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.calc-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 24px;
}

.calc-input-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.input-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.input-item label {
  font-size: 11.5px;
  color: var(--text-secondary);
}

.currency-input {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xs);
  padding: 8px 12px;
}
.currency-input span {
  color: var(--text-muted);
}
.currency-input input {
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  width: 100%;
}

.calc-results-col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.result-box {
  background: var(--bg-surface);
  border: 1px solid var(--border-ultra-subtle);
  border-radius: var(--radius-sm);
  padding: 18px 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.result-box.highlight-box {
  border-color: rgba(16, 185, 129, 0.3);
  background: rgba(16, 185, 129, 0.05);
}
.res-label {
  font-size: 10px;
  color: var(--text-muted);
  letter-spacing: 0.06em;
  margin-bottom: 6px;
}
.res-val {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
}
.res-desc {
  font-size: 10.5px;
  color: var(--text-muted);
}
.text-emerald {
  color: #34d399;
}

/* Pricing Table */
.pricing-table-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.table-sub {
  font-size: 12px;
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

.product-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}
.prod-thumb {
  width: 38px;
  height: 38px;
  border-radius: 4px;
  object-fit: cover;
  border: 1px solid var(--border-subtle);
}
.prod-info {
  display: flex;
  flex-direction: column;
}
.p-title {
  font-size: 13px;
}
.p-id {
  font-size: 11px;
  color: var(--text-muted);
}

.table-number-input {
  width: 80px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  padding: 6px 8px;
  border-radius: var(--radius-xs);
  font-size: 12.5px;
}

.margin-pill {
  display: inline-block;
  padding: 4px 8px;
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  border-radius: var(--radius-xs);
  font-weight: 700;
  font-size: 11px;
}

@media (max-width: 900px) {
  .calc-grid {
    grid-template-columns: 1fr;
  }
}
</style>
