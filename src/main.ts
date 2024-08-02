import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import storePinia from './storePinia';
import locale from 'element-plus/lib/locale/lang/zh-cn';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

createApp(App).use(router).use(store).use(storePinia).use(ElementPlus, { locale }).mount('#app');
