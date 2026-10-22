<template>
  <div class="products-catalog-page">
    <div class="page-header">
      <div>
        <h1 class="page-title font-display">PRODUCTS & CATEGORY CATALOG</h1>
        <p class="page-subtitle">Manage all live apparel drops, Printrove catalog SKUs, and category collections (His Edit, Her Edit, Oversized, Hoodies)</p>
      </div>

      <div class="header-actions">
        <router-link to="/design-upload" class="action-btn-primary font-tech">
          + DROP NEW PRODUCT
        </router-link>
      </div>
    </div>

    <!-- Category Circles Story Strip (Matching https://koroko.in) -->
    <div class="category-stories-card">
      <div class="strip-header">
        <span class="font-tech text-muted text-xs">LIVE STORE CATEGORIES & EDITIONS</span>
        <span class="badge badge-emerald">Real-Time Sync</span>
      </div>
      <div class="circles-row">
        <div 
          v-for="cat in categories" 
          :key="cat.id" 
          class="circle-item"
          :class="{ active: selectedCategoryFilter === cat.id }"
          @click="selectedCategoryFilter = cat.id"
        >
          <div class="circle-avatar">
            <img :src="cat.image" :alt="cat.name" />
          </div>
          <span class="circle-label font-tech">{{ cat.name.toUpperCase() }}</span>
        </div>
      </div>
    </div>

    <!-- Products List Table / Grid -->
    <div class="products-table-card">
      <div class="card-top-bar">
        <div class="search-wrap">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" stroke-width="2"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke-width="2"/>
          </svg>
          <input v-model="searchQuery" type="text" placeholder="Search by SKU, product name, or colorway..." />
        </div>

        <div class="filter-badge font-tech">
          Showing: {{ filteredProducts.length }} products
        </div>
      </div>

      <div class="table-container">
        <table class="luxury-table">
          <thead>
            <tr>
              <th>Garment & Mockup</th>
              <th>Category / Edit</th>
              <th>Colorways</th>
              <th>Cost Price</th>
              <th>Retail Price</th>
              <th>Gross Margin</th>
              <th>Store Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>
                <div class="prod-thumb-row">
                  <img :src="product.mockupFront" alt="Front Mockup" class="table-thumb" />
                  <img v-if="product.mockupBack" :src="product.mockupBack" alt="Back Mockup" class="table-thumb back-thumb" />
                  <div class="prod-names">
                    <span class="title font-semibold text-white">{{ product.title }}</span>
                    <span class="id-tag font-tech">{{ product.id }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="category-pill font-tech">
                  {{ getCategoryLabel(product.category) }}
                </span>
              </td>
              <td>
                <div class="color-tags">
                  <span v-for="c in product.colorways" :key="c" class="color-tag">
                    {{ c }}
                  </span>
                </div>
              </td>
              <td class="font-tech">&#8377;{{ (product.baseCost || 0) + (product.printCost || 0) }}</td>
              <td class="font-tech font-bold text-white">&#8377;{{ product.retailPrice }}</td>
              <td>
                <span class="margin-badge font-tech">
                  {{ calculateMargin(product) }}%
                </span>
              </td>
              <td>
                <span class="badge" :class="product.active ? 'badge-emerald' : 'badge-amber'">
                  {{ product.active ? 'LIVE ON STORE' : 'DRAFT' }}
                </span>
              </td>
              <td>
                <button class="toggle-btn font-tech" @click="toggleProductStatus(product)">
                  {{ product.active ? 'DELIST' : 'ACTIVATE' }}
                </button>
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
import { KOROKO_CATEGORIES } from '../data/categories.js';

const categories = ref(KOROKO_CATEGORIES);
const selectedCategoryFilter = ref('all');
const searchQuery = ref('');

const filteredProducts = computed(() => {
  return adminStore.products.filter(p => {
    const matchesCategory = selectedCategoryFilter.value === 'all' || 
      p.category === selectedCategoryFilter.value ||
      (selectedCategoryFilter.value === 'his' && (p.category === 'oversized' || p.category === 'hoodies')) ||
      (selectedCategoryFilter.value === 'her' && (p.category === 'croptops' || p.category === 'dresses'));

    const q = searchQuery.value.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch = p.title.toLowerCase().includes(q) || 
      p.id.toLowerCase().includes(q) ||
      (p.colorways && p.colorways.some(c => c.toLowerCase().includes(q)));

    return matchesCategory && matchesSearch;
  });
});

const getCategoryLabel = (catId) => {
  const match = categories.value.find(c => c.id === catId);
  return match ? match.name : catId;
};

const calculateMargin = (product) => {
  const cogs = (product.baseCost || 0) + (product.printCost || 0);
  if (!product.retailPrice) return 0;
  return Math.round(((product.retailPrice - cogs) / product.retailPrice) * 100);
};

const toggleProductStatus = (product) => {
  product.active = !product.active;
};
</script>

<style scoped>
.products-catalog-page {
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
}

/* Category Circles Story Strip */
.category-stories-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 18px 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.strip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.text-xs {
  font-size: 10.5px;
  letter-spacing: 0.08em;
}

.circles-row {
  display: flex;
  align-items: center;
  gap: 18px;
  overflow-x: auto;
  padding-bottom: 8px;
}
.circle-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
}
.circle-avatar {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: 2px solid var(--border-subtle);
  overflow: hidden;
  background: #000000;
  padding: 2px;
  transition: all 0.2s;
}
.circle-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.circle-item.active .circle-avatar, .circle-item:hover .circle-avatar {
  border-color: #ffffff;
  transform: scale(1.08);
}
.circle-label {
  font-size: 10px;
  color: var(--text-secondary);
  letter-spacing: 0.06em;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
}
.circle-item.active .circle-label {
  color: #ffffff;
  font-weight: 700;
}

/* Table Card */
.products-table-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.search-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 8px 14px;
  width: 360px;
}
.search-wrap input {
  background: transparent;
  border: none;
  outline: none;
  font-size: 13px;
  width: 100%;
}
.filter-badge {
  font-size: 11px;
  color: var(--text-muted);
}

.table-container {
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

.prod-thumb-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.table-thumb {
  width: 44px;
  height: 44px;
  border-radius: 4px;
  object-fit: cover;
  border: 1px solid var(--border-subtle);
}
.back-thumb {
  opacity: 0.8;
}
.prod-names {
  display: flex;
  flex-direction: column;
}
.prod-names .title {
  font-size: 13.5px;
}
.prod-names .id-tag {
  font-size: 10.5px;
  color: var(--text-muted);
}

.category-pill {
  font-size: 11px;
  color: var(--text-subtle);
  background: var(--bg-surface);
  padding: 3px 8px;
  border-radius: var(--radius-xs);
  border: 1px solid var(--border-ultra-subtle);
}

.color-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.color-tag {
  font-size: 10px;
  background: var(--bg-surface);
  padding: 2px 6px;
  border-radius: var(--radius-xs);
  color: var(--text-muted);
}

.margin-badge {
  color: #34d399;
  font-weight: 700;
  font-size: 12px;
}

.toggle-btn {
  font-size: 11px;
  border: 1px solid var(--border-subtle);
  padding: 5px 10px;
  border-radius: var(--radius-xs);
  color: var(--text-subtle);
  transition: all 0.2s;
}
.toggle-btn:hover {
  background: var(--bg-elevated);
  border-color: #ffffff;
  color: #ffffff;
}
</style>
