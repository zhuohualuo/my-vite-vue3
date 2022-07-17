import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import storePinia from './storePinia';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

createApp(App).use(router).use(store).use(storePinia).use(ElementPlus).mount('#app');
