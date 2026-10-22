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

      <!-- Navigation Links -->
      <nav class="sidebar-nav">
        <div class="nav-section-label">OPERATIONS</div>

        <router-link to="/" class="nav-item" active-class="active" exact>
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="7" height="7" rx="1.5" stroke-width="2"/>
            <rect x="14" y="3" width="7" height="7" rx="1.5" stroke-width="2"/>
            <rect x="14" y="14" width="7" height="7" rx="1.5" stroke-width="2"/>
            <rect x="3" y="14" width="7" height="7" rx="1.5" stroke-width="2"/>
          </svg>
          <span class="nav-label">Dashboard</span>
        </router-link>

        <router-link to="/orders" class="nav-item" active-class="active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1" stroke-width="2"/>
            <path d="M18 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4" stroke-width="2"/>
            <circle cx="5.5" cy="18.5" r="2.5" stroke-width="2"/>
            <circle cx="18.5" cy="18.5" r="2.5" stroke-width="2"/>
          </svg>
          <span class="nav-label">Orders</span>
          <span class="nav-count">{{ adminStore.orders.length }}</span>
        </router-link>

        <router-link to="/pending" class="nav-item" active-class="active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2"/>
            <polyline points="12 6 12 12 16 14" stroke-width="2"/>
          </svg>
          <span class="nav-label">Pending</span>
          <span class="nav-badge alert">{{ pendingCount }}</span>
        </router-link>

        <router-link to="/vendors" class="nav-item" active-class="active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke-width="2"/>
            <polyline points="9 22 9 12 15 12 15 22" stroke-width="2"/>
          </svg>
          <span class="nav-label">Vendors & POD</span>
        </router-link>

        <div class="nav-section-label">STUDIO & CATALOG</div>

        <router-link to="/design-upload" class="nav-item" active-class="active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-width="2"/>
            <polyline points="17 8 12 3 7 8" stroke-width="2"/>
            <line x1="12" y1="3" x2="12" y2="15" stroke-width="2"/>
          </svg>
          <span class="nav-label">T-Shirt Mockup Studio</span>
        </router-link>

        <router-link to="/pricing" class="nav-item" active-class="active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span class="nav-label">Pricing & Margins</span>
        </router-link>

        <router-link to="/payments" class="nav-item" active-class="active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke-width="2"/>
            <line x1="1" y1="10" x2="23" y2="10" stroke-width="2"/>
          </svg>
          <span class="nav-label">Payments & Razorpay</span>
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
            <div class="user-name">Director</div>
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
        <div class="topbar-search">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" stroke-width="2"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke-width="2"/>
          </svg>
          <input type="text" placeholder="Search orders, Printrove items, SKUs, or customer..." />
        </div>

        <div class="topbar-actions">
          <div class="system-sync-pill">
            <span class="sync-dot"></span>
            <span>Printrove Merchant #300632 Synced</span>
          </div>
          <button class="topbar-icon-btn" title="Sync Live Products">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- View Content -->
      <main class="admin-content-view">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { adminStore } from './state/store.js';
import { authState, adminLogout } from './services/firebase.js';

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
  font-family: var(--font-mono-tech);
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
  font-weight: 600;
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
}

.admin-topbar {
  height: var(--header-height);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  background: var(--bg-pitch);
  position: sticky;
  top: 0;
  z-index: 90;
}

.topbar-search {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  padding: 8px 16px;
  width: 400px;
}
.topbar-search input {
  background: transparent;
  border: none;
  outline: none;
  font-size: 13px;
  width: 100%;
}
.topbar-search svg {
  color: var(--text-muted);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.system-sync-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-family: var(--font-mono-tech);
  color: var(--text-muted);
  background: var(--bg-surface);
  padding: 6px 14px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-ultra-subtle);
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
  padding: 32px;
  overflow-y: auto;
}
</style>
