import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router/index.js';
import { initAuthListener } from './services/firebase.js';
import './style.css';

initAuthListener();

const app = createApp(App);
app.use(router);
app.mount('#app');
