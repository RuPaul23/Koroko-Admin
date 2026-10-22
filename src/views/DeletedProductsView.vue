<template>
  <div class="deleted-products-page">
    <div class="page-header">
      <div>
        <h1 class="page-title font-display">DELETED & ARCHIVED PRODUCTS</h1>
        <p class="page-subtitle">Inspect, restore, or list products back to the live Koroko store</p>
      </div>

      <div class="header-actions">
        <router-link to="/products" class="btn-back font-tech">
          &larr; BACK TO ACTIVE CATALOG
        </router-link>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="adminStore.deletedProducts.length === 0" class="empty-card">
      <div class="empty-title font-display">No Deleted Products</div>
      <div class="empty-desc font-tech">All vendor and custom drops are currently active or delisted in the main catalog.</div>
      <router-link to="/products" class="btn-catalog font-tech">VIEW LIVE CATALOG &rarr;</router-link>
    </div>

    <!-- Deleted Products Table -->
    <div v-else class="products-table-card">
      <div class="card-top-bar font-tech">
        <span>ARCHIVED / REMOVED APPAREL ({{ adminStore.deletedProducts.length }})</span>
      </div>

      <div class="table-container">
        <table class="luxury-table">
          <thead>
            <tr>
              <th>Garment & Mockup</th>
              <th>Category</th>
              <th>Original Price</th>
              <th>Archived Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in adminStore.deletedProducts" :key="product.id">
              <td>
                <div class="prod-thumb-row">
                  <div class="thumb-wrapper">
                    <img v-if="product.mockupFront" :src="product.mockupFront" alt="Front Mockup" class="table-thumb" />
                    <div v-else class="table-thumb-missing font-tech">NO FRONT</div>
                  </div>
                  <div class="thumb-wrapper">
                    <img v-if="product.mockupBack" :src="product.mockupBack" alt="Back Mockup" class="table-thumb back-thumb" />
                    <div v-else class="table-thumb-missing font-tech">NO BACK</div>
                  </div>
                  <div class="prod-names">
                    <span class="font-semibold text-white">{{ product.title }}</span>
                    <div class="id-row font-tech">
                      <span class="id-tag">{{ product.id }}</span>
                      <span class="vendor-tag font-tech">{{ product.vendor || (product.id.startsWith('QK') ? 'Qikink' : 'Printrove') }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span class="category-badge font-tech">{{ product.category }}</span>
              </td>
              <td class="font-tech text-white font-semibold">
                &#8377;{{ product.retailPrice || product.price || 0 }}
              </td>
              <td class="font-tech text-muted text-xs">
                {{ product.deletedAt || 'Recently' }}
              </td>
              <td class="actions-cell">
                <button class="list-btn font-tech" @click="listToStore(product)" title="Restore and push live to store">
                  LIST ON STORE &rarr;
                </button>
                <button class="restore-btn font-tech" @click="restoreProduct(product)" title="Restore as delisted draft">
                  RESTORE (DELISTED)
                </button>
                <button class="purge-btn font-tech" @click="permanentlyPurge(product)" title="Permanently delete from archive">
                  PURGE
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
import { adminStore, saveDeletedProducts } from '../state/store.js';

const listToStore = (product) => {
  product.active = true;
  delete product.deletedAt;

  // Add back to active catalog
  adminStore.products.unshift(product);

  // Remove from deleted list
  const idx = adminStore.deletedProducts.findIndex(p => p.id === product.id);
  if (idx !== -1) {
    adminStore.deletedProducts.splice(idx, 1);
  }
  saveDeletedProducts();

  alert(`"${product.title}" restored and LIVE on store!`);
};

const restoreProduct = (product) => {
  product.active = false;
  delete product.deletedAt;
  
  // Add back to active catalog
  adminStore.products.unshift(product);

  // Remove from deleted list
  const idx = adminStore.deletedProducts.findIndex(p => p.id === product.id);
  if (idx !== -1) {
    adminStore.deletedProducts.splice(idx, 1);
  }
  saveDeletedProducts();

  alert(`"${product.title}" restored as Delisted in catalog.`);
};

const permanentlyPurge = (product) => {
  if (confirm(`Permanently wipe "${product.title}" from local archive?`)) {
    const idx = adminStore.deletedProducts.findIndex(p => p.id === product.id);
    if (idx !== -1) {
      adminStore.deletedProducts.splice(idx, 1);
    }
    saveDeletedProducts();
  }
};
</script>

<style scoped>
.deleted-products-page {
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
  font-size: 22px;
  letter-spacing: 0.12em;
}
.page-subtitle {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 4px;
}

.btn-back {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  color: #ffffff;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-size: 11.5px;
  transition: all 0.2s;
}
.btn-back:hover {
  background: var(--bg-elevated);
}

.empty-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 60px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.empty-title {
  font-size: 18px;
  color: #ffffff;
}
.empty-desc {
  font-size: 12.5px;
  color: var(--text-muted);
}
.btn-catalog {
  background: #ffffff;
  color: #000000;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 12px;
  margin-top: 8px;
}

.products-table-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 20px;
}

.card-top-bar {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.table-container {
  overflow-x: auto;
}

.luxury-table {
  width: 100%;
  min-width: 760px;
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
.luxury-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
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
  background: #09090b;
  border: 1px solid #27272a;
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

.id-row {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}
.id-tag {
  color: var(--text-muted);
  font-size: 10px;
}
.vendor-tag {
  background: rgba(255, 255, 255, 0.08);
  color: #a1a1aa;
  font-size: 9px;
  padding: 1px 6px;
  border-radius: 3px;
}

.category-badge {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle);
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  color: var(--text-secondary);
}

.actions-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.list-btn {
  background: #34d399;
  color: #000000;
  border: none;
  font-weight: 700;
  font-size: 11px;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.list-btn:hover {
  background: #10b981;
}

.restore-btn {
  background: #1e1e24;
  border: 1px solid #3f3f46;
  color: #d4d4d8;
  font-size: 11px;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.restore-btn:hover {
  border-color: #ffffff;
  color: #ffffff;
}

.purge-btn {
  background: transparent;
  border: 1px solid rgba(244, 63, 94, 0.4);
  color: #fb7185;
  font-size: 11px;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
.purge-btn:hover {
  background: rgba(244, 63, 94, 0.15);
  border-color: #fb7185;
}
</style>
