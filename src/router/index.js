import { createRouter, createWebHistory } from 'vue-router'
import SidebarLayout from '@/layouts/SidebarLayout.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { layout: SidebarLayout },
      component: () => import('@/pages/Index.vue'),
    },
    {
      path: '/setting',
      name: 'setting',
      meta: { layout: SidebarLayout },
      component: () => import('@/pages/Setting.vue'),
    },
    {
      path: '/template',
      name: 'template',
      meta: { layout: SidebarLayout },
      component: () => import('@/pages/template/Index.vue'),
    },
    {
      path: '/template/form',
      name: 'template.form',
      meta: { layout: SidebarLayout },
      component: () => import('@/pages/template/Form.vue'),
    },
  ],
})

export default router
