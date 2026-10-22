<template>
  <div class="koroko-admin-layout" :class="{ 'auth-view': isLoginPage }">
    <!-- Left Luxury Sidebar (Only visible when logged in) -->
    <aside v-if="!isLoginPage" class="admin-sidebar">
      <div class="sidebar-header">
        <div class="brand-badge">
          <span class="brand-logo">K</span>
          <div class="brand-meta">
            <span class="brand-title">KOROKO</span>
            <span class="brand-sub">ADMIN PORTAL</span>
          </div>
        </div>
        <div class="live-status-pill">
          <span class="pulse-dot"></span>
          <span>LIVE</span>
        </div>
      </div>

      <!-- Navigation Links: 5 Core Modules -->
      <nav class="sidebar-nav">
        <div class="nav-section-label font-tech">MANAGEMENT</div>

        <router-link to="/" class="nav-item" active-class="active" exact>
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="7" height="7" rx="1.5" stroke-width="2"/>
            <rect x="14" y="3" width="7" height="7" rx="1.5" stroke-width="2"/>
            <rect x="14" y="14" width="7" height="7" rx="1.5" stroke-width="2"/>
            <rect x="3" y="14" width="7" height="7" rx="1.5" stroke-width="2"/>
          </svg>
          <span class="nav-label">Dashboard</span>
        </router-link>

        <router-link to="/products" class="nav-item" active-class="active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke-width="2"/>
            <line x1="3" y1="6" x2="21" y2="6" stroke-width="2"/>
            <path d="M16 10a4 4 0 0 1-8 0" stroke-width="2"/>
          </svg>
          <span class="nav-label">Product</span>
          <span class="nav-count">{{ adminStore.products.length }}</span>
        </router-link>

        <router-link to="/orders" class="nav-item" active-class="active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1" stroke-width="2"/>
            <path d="M18 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4" stroke-width="2"/>
            <circle cx="5.5" cy="18.5" r="2.5" stroke-width="2"/>
            <circle cx="18.5" cy="18.5" r="2.5" stroke-width="2"/>
          </svg>
          <span class="nav-label">Order</span>
          <span class="nav-count">{{ adminStore.orders.length }}</span>
        </router-link>

        <router-link to="/pending" class="nav-item" active-class="active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2"/>
            <polyline points="12 6 12 12 16 14" stroke-width="2"/>
          </svg>
          <span class="nav-label">Pending</span>
          <span class="nav-badge alert" v-if="pendingCount > 0">{{ pendingCount }}</span>
        </router-link>

        <router-link to="/payments" class="nav-item" active-class="active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke-width="2"/>
            <line x1="1" y1="10" x2="23" y2="10" stroke-width="2"/>
          </svg>
          <span class="nav-label">Earning</span>
        </router-link>

        <div class="nav-section-label font-tech mt-2">INTEGRATIONS</div>

        <router-link to="/vendors" class="nav-item sub-nav-item" active-class="active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke-width="2"/>
            <polyline points="9 22 9 12 15 12 15 22" stroke-width="2"/>
          </svg>
          <span class="nav-label">Vendors & Sync</span>
        </router-link>
      </nav>

      <!-- Store Quick Link & Session Logout -->
      <div class="sidebar-footer">
        <a href="https://koroko.in" target="_blank" class="live-store-button">
          <span>View Customer Store</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke-width="2"/>
            <polyline points="15 3 21 3 21 9" stroke-width="2"/>
            <line x1="10" y1="14" x2="21" y2="3" stroke-width="2"/>
          </svg>
        </a>

        <div class="user-profile-strip">
          <div class="avatar-circle">AD</div>
          <div class="user-info">
            <div class="user-name font-semibold">Director</div>
            <div class="user-role">{{ authState.user?.email || 'admin@koroko.in' }}</div>
          </div>
          <button @click="handleLogout" title="Logout" class="logout-btn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke-width="2"/>
              <polyline points="16 17 21 12 16 7" stroke-width="2"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Container -->
    <div class="admin-main">
      <header v-if="!isLoginPage" class="admin-topbar">
        <!-- Persistent Brand Badge -->
        <div class="topbar-brand">
          <span class="brand-k-logo font-display">K</span>
          <div class="brand-text-block">
            <span class="brand-name font-display">KOROKO</span>
            <span class="brand-badge-label font-tech">ADMIN</span>
          </div>
        </div>

        <!-- Global Responsive Search Bar -->
        <div class="topbar-search-box">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" stroke-width="2"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke-width="2"/>
          </svg>
          <input 
            v-model="searchKeyword" 
            type="text" 
            placeholder="Search catalog, orders, SKUs..." 
            class="topbar-search-input font-tech"
          />
        </div>

        <!-- Desktop Top Navigation Tabs (Dashboard, Product, Order, Pending, Earning) -->
        <nav class="topbar-nav-links">
          <router-link to="/" class="top-nav-btn font-tech" active-class="active" exact>
            DASHBOARD
          </router-link>
          <router-link to="/products" class="top-nav-btn font-tech" active-class="active">
            PRODUCT ({{ adminStore.products.length }})
          </router-link>
          <router-link to="/orders" class="top-nav-btn font-tech" active-class="active">
            ORDER ({{ adminStore.orders.length }})
          </router-link>
          <router-link to="/pending" class="top-nav-btn font-tech" active-class="active">
            PENDING
            <span v-if="pendingCount > 0" class="top-pill-badge">{{ pendingCount }}</span>
          </router-link>
          <router-link to="/payments" class="top-nav-btn font-tech" active-class="active">
            EARNING
          </router-link>
        </nav>

        <!-- Right Quick Actions -->
        <div class="topbar-actions">
          <div class="system-sync-pill font-tech">
            <span class="sync-dot"></span>
            <span class="sync-text">Live Sync</span>
          </div>
          <a href="https://koroko.in" target="_blank" class="topbar-icon-btn" title="View Customer Store (koroko.in)">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke-width="2"/>
              <polyline points="15 3 21 3 21 9" stroke-width="2"/>
              <line x1="10" y1="14" x2="21" y2="3" stroke-width="2"/>
            </svg>
          </a>
        </div>
      </header>

      <!-- View Content -->
      <main class="admin-content-view">
        <router-view />
      </main>

      <!-- Mobile Bottom Navigation Bar (Dashboard, Product, Order, Pending, Earning) matching reference -->
      <nav v-if="!isLoginPage" class="mobile-bottom-navbar">
        <router-link to="/" class="mobile-bottom-item" active-class="active" exact>
          <div class="m-icon-wrap">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke-width="2"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke-width="2"/>
            </svg>
          </div>
          <span class="m-label font-tech">Dashboard</span>
        </router-link>

        <router-link to="/products" class="mobile-bottom-item" active-class="active">
          <div class="m-icon-wrap">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke-width="2"/>
              <line x1="3" y1="6" x2="21" y2="6" stroke-width="2"/>
              <path d="M16 10a4 4 0 0 1-8 0" stroke-width="2"/>
            </svg>
            <span class="m-count">{{ adminStore.products.length }}</span>
          </div>
          <span class="m-label font-tech">Product</span>
        </router-link>

        <!-- Center Highlight: Drop/Orders -->
        <router-link to="/orders" class="mobile-bottom-item highlight" active-class="active">
          <div class="m-icon-center">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor">
              <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1" stroke-width="2"/>
              <path d="M18 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4" stroke-width="2"/>
              <circle cx="5.5" cy="18.5" r="2.5" stroke-width="2"/>
              <circle cx="18.5" cy="18.5" r="2.5" stroke-width="2"/>
            </svg>
          </div>
          <span class="m-label font-tech">Order</span>
        </router-link>

        <router-link to="/pending" class="mobile-bottom-item" active-class="active">
          <div class="m-icon-wrap">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke-width="2"/>
              <polyline points="12 6 12 12 16 14" stroke-width="2"/>
            </svg>
            <span v-if="pendingCount > 0" class="m-badge-dot"></span>
          </div>
          <span class="m-label font-tech">Pending</span>
        </router-link>

        <router-link to="/payments" class="mobile-bottom-item" active-class="active">
          <div class="m-icon-wrap">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke-width="2"/>
              <line x1="1" y1="10" x2="23" y2="10" stroke-width="2"/>
            </svg>
          </div>
          <span class="m-label font-tech">Earning</span>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { adminStore } from './state/store.js';
import { authState, adminLogout } from './services/firebase.js';

const searchKeyword = ref('');
const route = useRoute();
const router = useRouter();

const isLoginPage = computed(() => route.name === 'Login');

const pendingCount = computed(() => {
  return adminStore.orders.filter(o => o.fulfillmentStatus === 'PENDING_VENDOR' || o.fulfillmentStatus === 'PROCESSING').length;
});

const handleLogout = async () => {
  await adminLogout();
  router.push('/login');
};
</script>

<style scoped>
.koroko-admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-pitch);
}
.koroko-admin-layout.auth-view {
  display: block;
}

/* Sidebar */
.admin-sidebar {
  width: var(--sidebar-width);
  background-color: var(--bg-deep);
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 100;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 24px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-ultra-subtle);
}

.brand-badge {
  display: flex;
  align-items: center;
  gap: 12px;
}
.brand-logo {
  width: 34px;
  height: 34px;
  background: #ffffff;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 18px;
  border-radius: var(--radius-sm);
}
.brand-meta {
  display: flex;
  flex-direction: column;
}
.brand-title {
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: 0.15em;
  font-size: 14px;
}
.brand-sub {
  font-size: 10px;
  color: var(--text-muted);
  letter-spacing: 0.12em;
  font-family: var(--font-mono-tech);
}

.live-status-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-family: var(--font-mono-tech);
  letter-spacing: 0.08em;
  padding: 3px 8px;
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  border-radius: var(--radius-full);
  border: 1px solid rgba(16, 185, 129, 0.2);
}
.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #34d399;
  box-shadow: 0 0 8px #34d399;
}

/* Nav */
.sidebar-nav {
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  overflow-y: auto;
}

.nav-section-label {
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  padding: 12px 10px 6px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 13.5px;
  font-weight: 500;
  transition: all 0.2s ease;
}
.nav-item:hover {
  background: var(--bg-surface);
  color: #ffffff;
}
.nav-item.active {
  background: var(--bg-elevated);
  color: #ffffff;
  border-left: 3px solid #ffffff;
  font-weight: 600;
}

.sub-nav-item {
  font-size: 12px;
  opacity: 0.75;
}
.sub-nav-item:hover, .sub-nav-item.active {
  opacity: 1;
}

.nav-icon {
  width: 17px;
  height: 17px;
  opacity: 0.8;
}
.nav-item.active .nav-icon {
  opacity: 1;
}

.nav-label {
  flex: 1;
}

.nav-count {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-mono-tech);
}

.nav-badge.alert {
  background: var(--accent-brand);
  color: #ffffff;
  font-size: 11px;
  padding: 1px 7px;
  border-radius: var(--radius-full);
  font-weight: 700;
}

/* Footer in sidebar */
.sidebar-footer {
  padding: 16px 14px;
  border-top: 1px solid var(--border-ultra-subtle);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.live-store-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: var(--text-subtle);
  transition: all 0.2s;
}
.live-store-button:hover {
  border-color: var(--border-medium);
  background: var(--bg-elevated);
  color: #ffffff;
}

.user-profile-strip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 4px;
}
.avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #33333d, #1a1a20);
  border: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
}
.user-info {
  flex: 1;
  overflow: hidden;
}
.user-name {
  font-size: 12.5px;
}
.user-role {
  font-size: 10.5px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.logout-btn {
  padding: 6px;
  color: var(--text-muted);
  border-radius: var(--radius-xs);
  transition: color 0.2s;
}
.logout-btn:hover {
  color: var(--accent-rose);
}

/* Main Area */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
}

.admin-topbar {
  min-height: var(--header-height);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: var(--bg-pitch);
  position: sticky;
  top: 0;
  z-index: 90;
  gap: 16px;
}

.topbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.brand-k-logo {
  width: 32px;
  height: 32px;
  background: #ffffff;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 16px;
  border-radius: var(--radius-xs);
}
.brand-text-block {
  display: flex;
  flex-direction: column;
}
.brand-name {
  font-size: 13.5px;
  font-weight: 800;
  letter-spacing: 0.12em;
  line-height: 1.1;
}
.brand-badge-label {
  font-size: 9.5px;
  color: var(--text-muted);
  letter-spacing: 0.14em;
}

.topbar-search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  padding: 6px 14px;
  width: 280px;
  max-width: 100%;
  transition: all 0.2s ease;
}
.topbar-search-box:focus-within {
  border-color: #ffffff;
  background: var(--bg-elevated);
}
.topbar-search-box svg {
  color: var(--text-muted);
  flex-shrink: 0;
}
.topbar-search-input {
  background: transparent;
  border: none;
  outline: none;
  font-size: 11.5px;
  color: #ffffff;
  width: 100%;
}
.topbar-search-input::placeholder {
  color: var(--text-muted);
}

/* Topbar 5-Item Navigation */
.topbar-nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  padding: 4px 6px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-ultra-subtle);
}

.top-nav-btn {
  font-size: 11px;
  letter-spacing: 0.06em;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  transition: all 0.2s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
}

.top-nav-btn:hover {
  color: #ffffff;
  background: var(--bg-surface);
}

.top-nav-btn.active {
  background: #ffffff;
  color: #000000;
  font-weight: 700;
}

.top-pill-badge {
  background: var(--accent-brand);
  color: #ffffff;
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 999px;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.system-sync-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg-surface);
  padding: 6px 12px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-ultra-subtle);
  white-space: nowrap;
}
.sync-dot {
  width: 6px;
  height: 6px;
  background: #34d399;
  border-radius: 50%;
}

.topbar-icon-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  color: var(--text-secondary);
  transition: all 0.2s;
}
.topbar-icon-btn:hover {
  background: var(--bg-elevated);
  color: #ffffff;
}

.admin-content-view {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

/* Mobile Bottom Navigation Bar (Dashboard, Product, Order, Pending, Earning) */
.mobile-bottom-navbar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(10, 10, 14, 0.96);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 999;
  align-items: center;
  justify-content: space-around;
  padding: 0 8px;
}

.mobile-bottom-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 10px;
  letter-spacing: 0.04em;
  padding: 4px 10px;
  text-decoration: none;
  position: relative;
  transition: all 0.2s ease;
}

.mobile-bottom-item .m-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-bottom-item .m-count {
  position: absolute;
  top: -4px;
  right: -8px;
  background: rgba(255, 255, 255, 0.15);
  font-size: 9px;
  padding: 1px 4px;
  border-radius: 999px;
  color: #ffffff;
}

.mobile-bottom-item .m-badge-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 7px;
  height: 7px;
  background: var(--accent-brand);
  border-radius: 50%;
}

.mobile-bottom-item.active {
  color: #ffffff;
}

.mobile-bottom-item.active .m-label {
  font-weight: 700;
  color: #ffffff;
}

.mobile-bottom-item.highlight .m-icon-center {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #ffffff;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.25);
  margin-top: -16px;
  transition: transform 0.2s;
}

.mobile-bottom-item.highlight.active .m-icon-center {
  transform: scale(1.06);
}

/* Responsive Breakpoints */
@media (max-width: 900px) {
  .admin-sidebar {
    display: none;
  }

  .topbar-nav-links {
    display: none;
  }

  .mobile-bottom-navbar {
    display: flex;
  }

  .admin-content-view {
    padding: 16px 14px 80px 14px;
  }

  .admin-topbar {
    padding: 10px 14px;
    gap: 10px;
  }

  .topbar-brand {
    gap: 6px;
  }
  .brand-k-logo {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
  .brand-name {
    font-size: 12px;
  }
  .brand-badge-label {
    display: none;
  }

  .topbar-search-box {
    width: auto;
    flex: 1;
    padding: 5px 10px;
  }

  .system-sync-pill {
    padding: 5px 8px;
  }
  .system-sync-pill .sync-text {
    display: none;
  }
}
</style>
