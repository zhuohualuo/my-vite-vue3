import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home.vue')
  },
  {
    path: '/',
    redirect: {
      name: 'Home'
    }
  },
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('@/components/myComponent.vue')
  },
  {
    path: '/components',
    name: 'components',
    component: () => import('@/components/components.vue')
  },
  {
    path: '/hello',
    name: 'hello',
    component: () => import('@/components/HelloWorld.vue')
  },
  {
    path: '/props',
    name: 'props',
    component: () => import('@/views/propstest/father/index.vue')
  },
  {
    path: '/form',
    name: 'form',
    component: () => import('@/components/form/index.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
