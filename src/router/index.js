import { createRouter, createWebHistory } from 'vue-router';
import { authState } from '../services/firebase.js';

import DashboardView from '../views/DashboardView.vue';
import ProductsView from '../views/ProductsView.vue';
import VendorsView from '../views/VendorsView.vue';
import OrdersView from '../views/OrdersView.vue';
import PendingView from '../views/PendingView.vue';
import PaymentsView from '../views/PaymentsView.vue';
import DesignUploadView from '../views/DesignUploadView.vue';
import PricingView from '../views/PricingView.vue';
import LoginView from '../views/LoginView.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/vendors',
    name: 'Vendors',
    component: VendorsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: OrdersView,
    meta: { requiresAuth: true }
  },
  {
    path: '/pending',
    name: 'Pending',
    component: PendingView,
    meta: { requiresAuth: true }
  },
  {
    path: '/payments',
    name: 'Payments',
    component: PaymentsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/design-upload',
    name: 'DesignUpload',
    component: DesignUploadView,
    meta: { requiresAuth: true }
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: PricingView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.name === 'Login') {
    if (authState.isAuthenticated) {
      return next({ name: 'Dashboard' });
    }
    return next();
  }

  if (to.meta.requiresAuth && !authState.isAuthenticated) {
    const localAdmin = sessionStorage.getItem('koroko_admin_authenticated');
    if (localAdmin === 'true') {
      authState.isAuthenticated = true;
      authState.isAdmin = true;
      return next();
    }
    return next({ name: 'Login' });
  }

  next();
});
