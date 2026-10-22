<template>
  <div class="products-catalog-page">
    <div class="page-header">
      <div>
        <h1 class="page-title font-display">PRODUCTS & CATEGORY CATALOG</h1>
        <p class="page-subtitle">Manage all live apparel drops, Printrove & Qikink catalog SKUs, and categories</p>
      </div>
    </div>

    <!-- Vendor & Category Filter Controls -->
    <div class="catalog-filters-row">
      <div class="filter-dropdown-group">
        <label class="font-tech filter-lbl">VENDOR:</label>
        <select v-model="selectedVendorSegment" class="vendor-dropdown font-tech">
          <option value="all">All Vendors ({{ adminStore.products.length }})</option>
          <option value="printrove">Printrove ({{ printroveProductsCount }})</option>
          <option value="qikink">Qikink ({{ qikinkProductsCount }})</option>
        </select>
      </div>

      <div class="filter-dropdown-group">
        <label class="font-tech filter-lbl">CATEGORY:</label>
        <select v-model="selectedCategoryFilter" class="vendor-dropdown font-tech">
          <option value="all">All Categories</option>
          <option v-for="cat in categories.filter(c => c.id !== 'all')" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div class="sync-actions-group">
        <router-link to="/deleted-products" class="btn-deleted-page font-tech">
          DELETED ARCHIVE ({{ adminStore.deletedProducts.length }})
        </router-link>
        <button class="btn-sync-clean font-tech" @click="refreshCatalog">
          SYNC CATALOG
        </button>
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
              <th>Category</th>
              <th>Vendor (Total Cost)</th>
              <th>Our Store Price (&#8377;)</th>
              <th>Gross Margin</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>
                <div class="prod-thumb-row">
                  <!-- Front Image with Upload Replacement -->
                  <div class="thumb-wrapper">
                    <img v-if="product.mockupFront" :src="product.mockupFront" alt="Front Mockup" class="table-thumb" />
                    <div v-else class="table-thumb-missing font-tech">NO FRONT</div>
                    <label class="change-img-btn" title="Upload / Replace Front Image">
                      <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-width="2"/>
                        <polyline points="17 8 12 3 7 8" stroke-width="2"/>
                        <line x1="12" y1="3" x2="12" y2="15" stroke-width="2"/>
                      </svg>
                      <input type="file" accept="image/*" @change="onReplaceProductImage($event, product, 'front')" />
                    </label>
                  </div>

                  <!-- Back Image with Upload Replacement -->
                  <div class="thumb-wrapper">
                    <img v-if="product.mockupBack" :src="product.mockupBack" alt="Back Mockup" class="table-thumb back-thumb" />
                    <div v-else class="table-thumb-missing font-tech">NO BACK</div>
                    <label class="change-img-btn" title="Upload / Replace Back Image">
                      <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-width="2"/>
                        <polyline points="17 8 12 3 7 8" stroke-width="2"/>
                        <line x1="12" y1="3" x2="12" y2="15" stroke-width="2"/>
                      </svg>
                      <input type="file" accept="image/*" @change="onReplaceProductImage($event, product, 'back')" />
                    </label>
                  </div>

                  <div class="prod-names">
                    <input 
                      v-model="product.title" 
                      class="title-inline-edit font-semibold text-white" 
                      @blur="saveProductEdit(product)" 
                      title="Click to edit name"
                    />
                    <div class="id-row font-tech">
                      <span class="id-tag">{{ product.id }}</span>
                      <span class="vendor-tag font-tech">{{ product.vendor || (product.id.startsWith('QK') ? 'Qikink' : 'Printrove') }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <select v-model="product.category" class="category-select font-tech" @change="saveProductEdit(product)">
                  <option v-for="cat in categories.filter(c => c.id !== 'all')" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </td>
              <td>
                <div class="vendor-cost-col font-tech">
                  <span class="cost-val">&#8377;{{ (product.baseCost || 0) + (product.printCost || 0) }}</span>
                  <span class="cost-sub">Total Vendor Cost</span>
                </div>
              </td>
              <td>
                <div class="price-edit-cell">
                  <span class="currency-prefix font-tech">&#8377;</span>
                  <input 
                    v-model.number="product.retailPrice" 
                    type="number" 
                    class="price-input font-tech"
                    @blur="saveProductEdit(product)"
                  />
                </div>
              </td>
              <td>
                <span class="margin-badge font-tech" :class="calculateMargin(product) > 40 ? 'high' : ''">
                  {{ calculateMargin(product) }}%
                </span>
              </td>
              <td>
                <span class="status-pill font-tech" :class="product.active ? 'live' : 'delisted'">
                  {{ product.active ? 'LIVE ON STORE' : 'DELISTED' }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="push-store-btn font-tech" @click="pushToKorokoStore(product)" title="Approve and push directly to koroko.in">
                  PUSH TO STORE &rarr;
                </button>
                <button class="toggle-btn font-tech" @click="toggleProductStatus(product)">
                  {{ product.active ? 'DELIST' : 'ACTIVATE' }}
                </button>
                <button class="delete-btn font-tech" @click="deleteProduct(product)" title="Move to deleted archive">
                  DELETE
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
import { adminStore, saveDeletedProducts } from '../state/store.js';
import { KOROKO_CATEGORIES } from '../data/categories.js';

const categories = ref(KOROKO_CATEGORIES);
const selectedCategoryFilter = ref('all');
const selectedVendorSegment = ref('all');
const searchQuery = ref('');

const printroveProductsCount = computed(() => {
  return adminStore.products.filter(p => !p.id.startsWith('QK') && p.vendor !== 'Qikink').length;
});

const qikinkProductsCount = computed(() => {
  return adminStore.products.filter(p => p.id.startsWith('QK') || p.vendor === 'Qikink').length;
});

const filteredProducts = computed(() => {
  return adminStore.products.filter(p => {
    // 1. Vendor Segment Filter
    if (selectedVendorSegment.value === 'printrove') {
      if (p.id.startsWith('QK') || p.vendor === 'Qikink') return false;
    } else if (selectedVendorSegment.value === 'qikink') {
      if (!p.id.startsWith('QK') && p.vendor !== 'Qikink') return false;
    }

    // 2. Category Filter
    const matchesCategory = selectedCategoryFilter.value === 'all' || 
      p.category === selectedCategoryFilter.value ||
      (selectedCategoryFilter.value === 'his' && (p.category === 'oversized' || p.category === 'hoodies')) ||
      (selectedCategoryFilter.value === 'her' && (p.category === 'croptops' || p.category === 'dresses'));

    // 3. Search Query
    const q = searchQuery.value.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch = p.title.toLowerCase().includes(q) || 
      p.id.toLowerCase().includes(q) ||
      (p.colorways && p.colorways.some(c => c.toLowerCase().includes(q)));

    return matchesCategory && matchesSearch;
  });
});

const onReplaceProductImage = (e, product, side) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (side === 'front') {
        product.mockupFront = event.target.result;
      } else {
        product.mockupBack = event.target.result;
      }
      alert(`Updated ${side} image for "${product.title}"!`);
    };
    reader.readAsDataURL(file);
  }
};

const saveProductEdit = (product) => {
  console.log('Saved product updates:', product.id, product.title, product.retailPrice);
};

const pushToKorokoStore = (product) => {
  product.active = true;
  alert(`APPROVED! "${product.title}" has been pushed live to https://koroko.in customer store with retail price ₹${product.retailPrice}!`);
};

const refreshCatalog = () => {
  alert('Syncing live dress catalog from Printrove & Qikink warehouses...');
};

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

const deleteProduct = async (product) => {
  if (confirm(`Move "${product.title}" (${product.id}) to Deleted Products Archive? You can restore it anytime.`)) {
    try {
      const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
      const backendUrl = isLocal ? 'https://admin.koroko.in/api/real-data' : '/api/real-data';

      await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete-product',
          productId: product.id
        })
      });
    } catch (e) {}

    const idx = adminStore.products.findIndex(p => p.id === product.id);
    if (idx !== -1) {
      const removed = adminStore.products.splice(idx, 1)[0];
      removed.deletedAt = new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
      adminStore.deletedProducts.unshift(removed);
      saveDeletedProducts();
    }
    alert(`"${product.title}" moved to Deleted Archive!`);
  }
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

/* Catalog Filters Row */
.catalog-filters-row {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 14px 20px;
  flex-wrap: wrap;
}

.filter-dropdown-group {
  display: flex;
  align-items: center;
  gap: 8px;
}
.filter-lbl {
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 0.08em;
}

.vendor-dropdown {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  color: #ffffff;
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
}
.vendor-dropdown:focus {
  border-color: #ffffff;
}

.sync-actions-group {
  margin-left: auto;
}
.btn-sync-clean {
  background: #ffffff;
  color: #000000;
  border: none;
  padding: 8px 18px;
  border-radius: var(--radius-sm);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-sync-clean:hover {
  background: #e4e4e7;
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

.vendor-segment-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 12px 18px;
  flex-wrap: wrap;
  gap: 12px;
}
.segment-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.segment-tab {
  background: #18181b;
  border: 1px solid #27272a;
  color: #a1a1aa;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}
.segment-tab.active {
  background: #ffffff;
  color: #000000;
  border-color: #ffffff;
  font-weight: 700;
}
.btn-sync-vendor {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-sync-vendor:hover {
  background: #34d399;
  color: #000000;
}

.thumb-wrapper {
  position: relative;
  display: inline-block;
}
.table-thumb-missing {
  width: 44px;
  height: 44px;
  border-radius: 4px;
  background: #18181b;
  border: 1px dashed #3f3f46;
  color: #71717a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  text-align: center;
}
.change-img-btn {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: #27272a;
  border: 1px solid #52525b;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  cursor: pointer;
}
.change-img-btn input {
  display: none;
}

.title-inline-edit {
  background: transparent;
  border: 1px solid transparent;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 13px;
  width: 240px;
  outline: none;
}
.title-inline-edit:focus {
  background: #18181b;
  border-color: #52525b;
}

.id-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
.vendor-tag {
  background: rgba(255, 255, 255, 0.08);
  color: #a1a1aa;
  font-size: 9px;
  padding: 1px 6px;
  border-radius: 3px;
}

.category-select {
  background: #18181b;
  border: 1px solid #27272a;
  color: #e4e4e7;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
}

.vendor-cost-col {
  display: flex;
  flex-direction: column;
}
.vendor-cost-col .cost-val {
  font-weight: 700;
  color: #f59e0b;
  font-size: 13px;
}
.vendor-cost-col .cost-sub {
  font-size: 9.5px;
  color: var(--text-muted);
}

.price-edit-cell {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #141416;
  border: 1px solid #27272a;
  padding: 4px 8px;
  border-radius: 6px;
  width: 90px;
}
.currency-prefix {
  font-size: 12px;
  color: var(--text-muted);
}
.price-input {
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-weight: 700;
  font-size: 13px;
  width: 100%;
}

.btn-deleted-page {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--text-secondary);
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  letter-spacing: 0.06em;
  transition: all 0.2s;
  text-decoration: none;
}
.btn-deleted-page:hover {
  border-color: #ffffff;
  color: #ffffff;
  background: var(--bg-surface);
}

.status-pill {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  white-space: nowrap;
}
.status-pill.live {
  background: rgba(16, 185, 129, 0.12);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}
.status-pill.delisted {
  background: rgba(245, 158, 11, 0.12);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.actions-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.push-store-btn {
  background: #ffffff;
  color: #000000;
  border: none;
  font-weight: 700;
  font-size: 11px;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.push-store-btn:hover {
  background: #34d399;
}

.toggle-btn {
  background: #1e1e24;
  border: 1px solid #3f3f46;
  color: #d4d4d8;
  font-size: 10.5px;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
.toggle-btn:hover {
  color: #ffffff;
  border-color: #ffffff;
}

.delete-btn {
  background: transparent;
  border: 1px solid rgba(244, 63, 94, 0.3);
  color: #fb7185;
  font-size: 10.5px;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
.delete-btn:hover {
  background: rgba(244, 63, 94, 0.15);
  border-color: #fb7185;
}
</style>
