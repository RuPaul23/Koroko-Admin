import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router/index.js';
import { initAuthListener } from './services/firebase.js';
import { syncRealData } from './state/store.js';
import './style.css';

initAuthListener();
syncRealData();

// Auto-refresh store data every 60 seconds with minimal background sync
setInterval(() => {
  syncRealData(true);
}, 60000);

const app = createApp(App);
app.use(router);
app.mount('#app');

