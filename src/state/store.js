// ==============================================================================
// KOROKO-ADMIN — Central State & Data Management Store
// ==============================================================================

import { reactive } from 'vue';

export const adminStore = reactive({
  // Global Metrics
  metrics: {
    totalRevenue: 284950,
    activeOrders: 42,
    pendingFulfillment: 9,
    catalogItems: 24,
    activeVendors: 3
  },

  // Vendors / Print-On-Demand Providers
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
      name: 'Qikink POD Warehouse',
      status: 'STANDBY',
      merchantId: 'QK-9921',
      email: 'logistics@koroko.in',
      endpoint: 'https://api.qikink.com/v1',
      autoSync: false,
      lastSync: '2 days ago',
      productsSynced: 12,
      ordersFulfilled: 88,
      health: 'Standby Ready'
    },
    {
      id: 'local_dtg',
      name: 'Koroko Direct DTG Studio (Bengaluru)',
      status: 'ACTIVE',
      merchantId: 'KOROKO-HQ-01',
      email: 'studio@koroko.in',
      endpoint: 'Direct Local Dispatch',
      autoSync: true,
      lastSync: 'Just now',
      productsSynced: 8,
      ordersFulfilled: 120,
      health: 'Active Onsite'
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
        { title: 'Oversized Anime Heavyweight Tee • Phantom Black', size: 'XL', qty: 1, price: 1499 }
      ],
      total: 1499,
      paymentMethod: 'Razorpay UPI (rzp_live_*)',
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
        { title: 'Minimalist Tokyo Noir Boxy Tee • Off White', size: 'M', qty: 2, price: 1299 }
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
      vendor: 'Direct DTG Studio',
      vendorOrderId: 'BLR-0412',
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
      category: 'T-Shirts',
      colorways: ['Phantom Black', 'Bone White', 'Acid Charcoal'],
      baseCost: 480,
      printCost: 190,
      retailPrice: 1499,
      mrp: 2499,
      margin: '55.3%',
      active: true,
      mockupFront: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      mockupBack: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'koroko-tee-boxy-02',
      title: 'Tokyo Street Boxy Drop-Cut Tee',
      category: 'T-Shirts',
      colorways: ['Off White', 'Pitch Black', 'Slate Grey'],
      baseCost: 450,
      printCost: 170,
      retailPrice: 1399,
      mrp: 2299,
      margin: '55.6%',
      active: true,
      mockupFront: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
      mockupBack: ''
    },
    {
      id: 'koroko-hoodie-01',
      title: 'Monochrome 400 GSM French Terry Hoodie',
      category: 'Hoodies',
      colorways: ['Pitch Black', 'Heather Grey'],
      baseCost: 950,
      printCost: 250,
      retailPrice: 2899,
      mrp: 4499,
      margin: '58.6%',
      active: true,
      mockupFront: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      mockupBack: ''
    }
  ],

  // Design Upload Queue / Print Placements
  designDrafts: []
});
