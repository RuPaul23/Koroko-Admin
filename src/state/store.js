// ==============================================================================
// KOROKO-ADMIN — Central State & Real Data Sync Store
// ==============================================================================

import { reactive } from 'vue';

export const adminStore = reactive({
  loading: false,

  metrics: {
    totalRevenue: 0,
    activeOrders: 0,
    pendingFulfillment: 0,
    catalogItems: 0,
    activeVendors: 2
  },

  vendors: [
    {
      id: 'printrove',
      name: 'Printrove Custom Store API',
      status: 'CONNECTED',
      merchantId: '300632',
      email: 'korokoindia@gmail.com',
      endpoint: 'https://api.printrove.com/api',
      autoSync: true,
      lastSync: 'Live API',
      productsSynced: 13,
      ordersFulfilled: 0,
      health: 'Optimal (99.8%)'
    },
    {
      id: 'qikink',
      name: 'Qikink POD Warehouse API',
      status: 'CONNECTED',
      merchantId: '965251068008604',
      email: 'logistics@koroko.in',
      endpoint: 'https://api.qikink.com/api',
      autoSync: false,
      lastSync: 'Standby Ready',
      productsSynced: 0,
      ordersFulfilled: 0,
      health: 'Active Ready'
    }
  ],

  // Real Customer Orders fetched from API
  orders: [],

  // Real Products fetched from Printrove API
  products: []
});

/**
 * Fetch real live products and orders from the backend API
 */
export async function syncRealData() {
  adminStore.loading = true;
  try {
    const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    const baseUrl = isLocal ? 'https://admin.koroko.in/api/real-data' : '/api/real-data';

    // 1. Fetch live products from Printrove
    const prodRes = await fetch(`${baseUrl}?type=products`);
    if (prodRes.ok) {
      const prodData = await prodRes.json();
      if (prodData.success && Array.isArray(prodData.products) && prodData.products.length > 0) {
        adminStore.products = prodData.products;
        adminStore.metrics.catalogItems = prodData.products.length;
      }
    }

    // 2. Fetch live orders
    const orderRes = await fetch(`${baseUrl}?type=orders`);
    if (orderRes.ok) {
      const orderData = await orderRes.json();
      if (orderData.success && Array.isArray(orderData.orders)) {
        adminStore.orders = orderData.orders;
        adminStore.metrics.activeOrders = orderData.orders.length;
        adminStore.metrics.pendingFulfillment = orderData.orders.filter(o => 
          o.fulfillmentStatus === 'PENDING_VENDOR' || o.fulfillmentStatus === 'PROCESSING' || o.fulfillmentStatus === 'PENDING'
        ).length;
        adminStore.metrics.totalRevenue = orderData.orders.reduce((acc, o) => acc + (o.total || 0), 0);
      }
    }
  } catch (err) {
    console.warn('[Real Data Sync] Fallback: ', err.message);
  } finally {
    adminStore.loading = false;
  }
}
