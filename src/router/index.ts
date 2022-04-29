import {createRouter,createWebHashHistory,RouteRecordRaw} from 'vue-router'
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
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router