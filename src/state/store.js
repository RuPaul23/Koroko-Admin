// ==============================================================================
// KOROKO-ADMIN — Central State & Data Management Store
// ==============================================================================

import { reactive } from 'vue';

export const adminStore = reactive({
  metrics: {
    totalRevenue: 284950,
    activeOrders: 42,
    pendingFulfillment: 9,
    catalogItems: 24,
    activeVendors: 2
  },

  // Vendors: Printrove & Qikink with real credentials
  vendors: [
    {
      id: 'printrove',
      name: 'Printrove Custom Store API',
      status: 'CONNECTED',
      merchantId: '300632',
      email: 'korokoindia@gmail.com',
      endpoint: 'https://api.printrove.com/api',
      autoSync: true,
      lastSync: '10 mins ago',
      productsSynced: 48,
      ordersFulfilled: 342,
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
      lastSync: '1 hour ago',
      productsSynced: 24,
      ordersFulfilled: 112,
      health: 'Active Ready'
    }
  ],

  // All Customer Orders
  orders: [
    {
      id: 'ORD-8941',
      customer: 'Aarav Sharma',
      email: 'aarav.sharma@gmail.com',
      phone: '+91 98210 44123',
      date: '2026-10-22 11:20 AM',
      items: [
        { title: 'Oversized Anime Heavyweight Tee - Phantom Black', size: 'XL', qty: 1, price: 1499 }
      ],
      total: 1499,
      paymentMethod: 'Razorpay UPI (rzp_live)',
      paymentStatus: 'PAID',
      fulfillmentStatus: 'PENDING_VENDOR',
      vendor: 'Printrove',
      vendorOrderId: 'PR-892301',
      shippingAddress: 'Flat 402, Skyline Residency, Indiranagar, Bengaluru, 560038'
    },
    {
      id: 'ORD-8940',
      customer: 'Priya Iyer',
      email: 'priya.iyer@outlook.com',
      phone: '+91 98450 11982',
      date: '2026-10-22 09:45 AM',
      items: [
        { title: 'Minimalist Tokyo Noir Boxy Tee - Off White', size: 'M', qty: 2, price: 1299 }
      ],
      total: 2598,
      paymentMethod: 'Razorpay Netbanking',
      paymentStatus: 'PAID',
      fulfillmentStatus: 'PROCESSING',
      vendor: 'Printrove',
      vendorOrderId: 'PR-892290',
      shippingAddress: 'Villa 12, Greenwood Meadows, Whitefield, Bengaluru, 560066'
    },
    {
      id: 'ORD-8939',
      customer: 'Kabir Verma',
      email: 'kabir.v@gmail.com',
      phone: '+91 97110 99823',
      date: '2026-10-21 07:15 PM',
      items: [
        { title: 'Cyberpunk Aesthetic Acid Wash Hoodie', size: 'L', qty: 1, price: 2899 }
      ],
      total: 2899,
      paymentMethod: 'UPI (Google Pay)',
      paymentStatus: 'PAID',
      fulfillmentStatus: 'DISPATCHED',
      vendor: 'Qikink',
      vendorOrderId: 'QK-0412',
      shippingAddress: 'B-204, Palm Springs, Golf Course Road, Gurugram, 122002'
    },
    {
      id: 'ORD-8938',
      customer: 'Neha Singhania',
      email: 'neha.singhania@yahoo.com',
      phone: '+91 98300 23145',
      date: '2026-10-21 04:30 PM',
      items: [
        { title: 'Monochrome Acid Wash Drop-Shoulder Tee', size: 'S', qty: 1, price: 1399 }
      ],
      total: 1399,
      paymentMethod: 'Razorpay UPI',
      paymentStatus: 'PAID',
      fulfillmentStatus: 'DELIVERED',
      vendor: 'Printrove',
      vendorOrderId: 'PR-891902',
      shippingAddress: '48, Park Street, 3rd Floor, Kolkata, 700016'
    },
    {
      id: 'ORD-8937',
      customer: 'Rohan Mehta',
      email: 'rohan.mehta@gmail.com',
      phone: '+91 99090 88210',
      date: '2026-10-20 02:10 PM',
      items: [
        { title: 'Japanese Kanji Signature Heavyweight Tee', size: 'XXL', qty: 1, price: 1599 }
      ],
      total: 1599,
      paymentMethod: 'Razorpay Credit Card',
      paymentStatus: 'REFUNDED',
      fulfillmentStatus: 'CANCELLED',
      vendor: 'Printrove',
      vendorOrderId: 'PR-891720',
      shippingAddress: 'Plot 104, Bodakdev, Ahmedabad, 380054'
    }
  ],

  // Products and Pricing Configuration
  products: [
    {
      id: 'koroko-tee-heavy-01',
      title: 'Oversized Heavyweight 240 GSM Tee',
      category: 'oversized',
      colorways: ['Black', 'White', 'Navy Blue'],
      baseCost: 480,
      printCost: 190,
      retailPrice: 1499,
      mrp: 2499,
      margin: '55.3%',
      active: true,
      mockupFront: 'https://cdn.printrove.com/merchants/300632/templates/1001001648/store-mockups/black/mockups/e5cef519-1e79-4945-8418-1b7d83807b91-mockup-1371-498-black-1792312333069.webp',
      mockupBack: 'https://cdn.printrove.com/merchants/300632/templates/1001001648/store-mockups/black/mockups/b4f09df2-40b0-49f2-a797-2f701d5f52fa-mockup-1371-499-black-1792312334325.webp'
    },
    {
      id: 'koroko-croptop-01',
      title: 'Shibuya Rebel Baby Crop Tee',
      category: 'croptops',
      colorways: ['Iris Lavender', 'Butter Yellow', 'Black'],
      baseCost: 259,
      printCost: 150,
      retailPrice: 599,
      mrp: 1199,
      margin: '52.0%',
      active: true,
      mockupFront: 'https://cdn.printrove.com/merchants/300632/templates/1001001622/store-mockups/iris-lavender/mockups/52e2dbc6-9c42-4c8d-bb40-073abb4806b4-mockup-464-704-iris-lavender-1792302355004.webp',
      mockupBack: 'https://cdn.printrove.com/merchants/300632/templates/1001001622/store-mockups/iris-lavender/mockups/53e8346a-aff8-4a59-84cb-fdbac55c3904-mockup-464-743-iris-lavender-1792302356180.webp'
    },
    {
      id: 'koroko-hoodie-01',
      title: 'Shibuya Coordinates Oversized Hoodie',
      category: 'hoodies',
      colorways: ['Navy Blue', 'Black', 'White'],
      baseCost: 672,
      printCost: 250,
      retailPrice: 1499,
      mrp: 2799,
      margin: '46.0%',
      active: true,
      mockupFront: 'https://cdn.printrove.com/merchants/300632/templates/1001001648/store-mockups/navy-blue/mockups/5183d1a1-cbf6-4f3f-9914-ed686826f131-mockup-1371-498-navy-blue-1792312335603.webp',
      mockupBack: 'https://cdn.printrove.com/merchants/300632/templates/1001001648/store-mockups/navy-blue/mockups/259cf9d4-5545-49bd-8b33-e517f1c57caf-mockup-1371-499-navy-blue-1792312337734.webp'
    }
  ]
});
