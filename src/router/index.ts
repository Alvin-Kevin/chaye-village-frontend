import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/FrontendLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('@/views/frontend/Home.vue') },
      { path: 'village', name: 'Village', component: () => import('@/views/frontend/Village.vue') },
      { path: 'products', name: 'Products', component: () => import('@/views/frontend/Products.vue') },
      { path: 'products/:id', name: 'ProductDetail', component: () => import('@/views/frontend/ProductDetail.vue') },
      { path: 'spots', name: 'Spots', component: () => import('@/views/frontend/Spots.vue') },
      { path: 'spots/:id', name: 'SpotDetail', component: () => import('@/views/frontend/SpotDetail.vue') },
      { path: 'yi-culture', name: 'YiCulture', component: () => import('@/views/frontend/YiCulture.vue') },
      { path: 'articles', name: 'Articles', component: () => import('@/views/frontend/Articles.vue') },
      { path: 'articles/:id', name: 'ArticleDetail', component: () => import('@/views/frontend/ArticleDetail.vue') },
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/frontend/DataDashboard.vue') },
    ]
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'AdminHome', component: () => import('@/views/admin/Dashboard.vue') },
      { path: 'login', name: 'AdminLogin', component: () => import('@/views/admin/Login.vue'), meta: { requiresAuth: false } },
      { path: 'banners', name: 'AdminBanners', component: () => import('@/views/admin/Banners.vue') },
      { path: 'village', name: 'AdminVillage', component: () => import('@/views/admin/VillageInfo.vue') },
      { path: 'products', name: 'AdminProducts', component: () => import('@/views/admin/Products.vue') },
      { path: 'products/create', name: 'AdminProductCreate', component: () => import('@/views/admin/ProductForm.vue') },
      { path: 'products/:id/edit', name: 'AdminProductEdit', component: () => import('@/views/admin/ProductForm.vue') },
      { path: 'spots', name: 'AdminSpots', component: () => import('@/views/admin/Spots.vue') },
      { path: 'spots/create', name: 'AdminSpotCreate', component: () => import('@/views/admin/SpotForm.vue') },
      { path: 'spots/:id/edit', name: 'AdminSpotEdit', component: () => import('@/views/admin/SpotForm.vue') },
      { path: 'articles', name: 'AdminArticles', component: () => import('@/views/admin/Articles.vue') },
      { path: 'articles/create', name: 'AdminArticleCreate', component: () => import('@/views/admin/ArticleForm.vue') },
      { path: 'articles/:id/edit', name: 'AdminArticleEdit', component: () => import('@/views/admin/ArticleForm.vue') },
      { path: 'categories', name: 'AdminCategories', component: () => import('@/views/admin/Categories.vue') },
      { path: 'stats', name: 'AdminStats', component: () => import('@/views/admin/StatsEditor.vue') },
      { path: 'settings', name: 'AdminSettings', component: () => import('@/views/admin/Settings.vue') },
    ]
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/NotFound.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('admin_token')
  if (to.meta.requiresAuth !== false && to.path.startsWith('/admin') && !token) {
    next('/admin/login')
  } else if (to.path === '/admin/login' && token) {
    next('/admin')
  } else {
    next()
  }
})

export default router
