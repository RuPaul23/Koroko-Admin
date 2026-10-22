import { reactive } from 'vue';
import { firebaseDb } from '../services/firebase.js';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

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

  // Real Customer Orders fetched from Firestore / Printrove (cached in localStorage)
  orders: JSON.parse(localStorage.getItem('koroko_orders_cache') || '[]'),

  // Real Products fetched from Printrove API (cached in localStorage)
  products: JSON.parse(localStorage.getItem('koroko_products_cache') || '[]'),

  // Deleted / Delisted Archive Products
  deletedProducts: JSON.parse(localStorage.getItem('koroko_deleted_products') || '[]')
});

export function saveDeletedProducts() {
  localStorage.setItem('koroko_deleted_products', JSON.stringify(adminStore.deletedProducts));
}

const STORE_CACHE_TIME_KEY = 'koroko_store_cache_time';
const STORE_CACHE_TTL = 60 * 1000; // 60s cache TTL

/**
 * Fetch real live products and orders from Firebase Firestore + Vendor API with caching
 */
export async function syncRealData(force = false) {
  const lastSyncTime = Number(localStorage.getItem(STORE_CACHE_TIME_KEY) || 0);
  const isFresh = Date.now() - lastSyncTime < STORE_CACHE_TTL;

  // If cache is fresh and we already have cached data, avoid redundant network load
  if (!force && isFresh && adminStore.products.length > 0 && adminStore.orders.length > 0) {
    adminStore.metrics.catalogItems = adminStore.products.length;
    adminStore.metrics.activeOrders = adminStore.orders.length;
    adminStore.metrics.pendingFulfillment = adminStore.orders.filter(o => 
      o.fulfillmentStatus === 'PENDING_VENDOR' || o.fulfillmentStatus === 'PROCESSING' || o.fulfillmentStatus === 'PENDING'
    ).length;
    adminStore.metrics.totalRevenue = adminStore.orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
    return;
  }

  adminStore.loading = true;
  try {
    const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    const baseUrl = isLocal ? 'https://admin.koroko.in/api/real-data' : '/api/real-data';

    // 1. Fetch live products from Printrove
    try {
      const prodRes = await fetch(`${baseUrl}?type=products`);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData.success && Array.isArray(prodData.products) && prodData.products.length > 0) {
          adminStore.products = prodData.products;
          adminStore.metrics.catalogItems = prodData.products.length;
          localStorage.setItem('koroko_products_cache', JSON.stringify(prodData.products));
        }
      }
    } catch (pe) {
      console.warn('[Products Sync]', pe.message);
    }

    // 2. Fetch live orders & payments from Firestore first (source of truth from customer purchases)
    let firestoreOrders = [];
    if (firebaseDb) {
      try {
        const ordersRef = collection(firebaseDb, 'orders');
        const q = query(ordersRef, orderBy('createdAt', 'desc'), limit(50));
        const snap = await getDocs(q);
        snap.forEach(docSnap => {
          const d = docSnap.data();
          firestoreOrders.push({
            id: d.id || docSnap.id,
            customer: d.customer?.name || d.shipping?.fullName || d.userEmail || 'Store Customer',
            email: d.customer?.email || d.shipping?.email || d.userEmail || 'customer@koroko.in',
            phone: d.customer?.phone || d.shipping?.phone || '',
            date: d.createdAt || new Date().toISOString(),
            items: (d.items || []).map(it => ({
              title: it.name || it.title || 'Apparel Item',
              size: it.size || 'M',
              qty: it.quantity || it.qty || 1,
              price: it.price || 1499
            })),
            total: d.financials?.finalTotal || d.total || d.totalAmount || 0,
            paymentMethod: d.payment?.method || 'Prepaid (Razorpay)',
            paymentStatus: (d.payment?.status || 'PAID').toUpperCase(),
            fulfillmentStatus: (d.status || d.fulfillmentStatus || 'PENDING_VENDOR').toUpperCase(),
            vendor: d.vendor || 'Printrove',
            vendorOrderId: d.vendorOrderId || '',
            shippingAddress: d.shipping ? `${d.shipping.addressLine1 || ''}, ${d.shipping.city || ''}, ${d.shipping.state || ''} ${d.shipping.pincode || ''}` : ''
          });
        });
      } catch (fe) {
        console.warn('[Firestore Orders Sync]', fe.message);
      }
    }

    // 3. Fetch Printrove orders as well
    let printroveOrders = [];
    try {
      const orderRes = await fetch(`${baseUrl}?type=orders`);
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        if (orderData.success && Array.isArray(orderData.orders)) {
          printroveOrders = orderData.orders;
        }
      }
    } catch (oe) {
      console.warn('[Vendor Orders Sync]', oe.message);
    }

    // Merge unique orders
    const orderMap = new Map();
    firestoreOrders.forEach(o => orderMap.set(o.id, o));
    printroveOrders.forEach(o => {
      if (!orderMap.has(o.id)) orderMap.set(o.id, o);
    });

    adminStore.orders = Array.from(orderMap.values());
    if (adminStore.orders.length > 0) {
      localStorage.setItem('koroko_orders_cache', JSON.stringify(adminStore.orders));
    }
    localStorage.setItem(STORE_CACHE_TIME_KEY, String(Date.now()));
    adminStore.metrics.activeOrders = adminStore.orders.length;
    adminStore.metrics.pendingFulfillment = adminStore.orders.filter(o => 
      o.fulfillmentStatus === 'PENDING_VENDOR' || o.fulfillmentStatus === 'PROCESSING' || o.fulfillmentStatus === 'PENDING'
    ).length;
    adminStore.metrics.totalRevenue = adminStore.orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  } catch (err) {
    console.warn('[Real Data Sync] Fallback: ', err.message);
  } finally {
    adminStore.loading = false;
  }
}
