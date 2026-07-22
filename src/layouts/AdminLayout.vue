<template>
  <div class="admin-layout" v-if="route.path !== '/admin/login'">
    <aside class="sidebar">
      <div class="sidebar-header">
        <router-link to="/admin" class="sidebar-logo">🍃 后台管理</router-link>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#1A1A1A"
        text-color="#ccc"
        active-text-color="#FFD700"
      >
        <el-menu-item index="/admin">
          <el-icon><DataBoard /></el-icon>
          <span>工作台</span>
        </el-menu-item>
        <el-menu-item index="/admin/banners">
          <el-icon><Picture /></el-icon>
          <span>Banner管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/village">
          <el-icon><Document /></el-icon>
          <span>村庄介绍</span>
        </el-menu-item>
        <el-menu-item index="/admin/products">
          <el-icon><Goods /></el-icon>
          <span>产品管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/spots">
          <el-icon><Location /></el-icon>
          <span>景点管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/articles">
          <el-icon><Notebook /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/categories">
          <el-icon><Collection /></el-icon>
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/admin/stats">
          <el-icon><TrendCharts /></el-icon>
          <span>数据统计</span>
        </el-menu-item>
        <el-menu-item index="/admin/settings">
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </el-menu-item>
      </el-menu>
    </aside>
    <div class="admin-main">
      <header class="admin-header">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-if="route.meta.title">{{ route.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="admin-header-right">
          <span class="admin-user">管理员</span>
          <el-button type="danger" size="small" @click="handleLogout">退出</el-button>
        </div>
      </header>
      <div class="admin-content">
        <router-view />
      </div>
    </div>
  </div>
  <router-view v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const activeMenu = computed(() => {
  const path = route.path
  // child routes like /admin/products/create → highlight /admin/products
  const segments = path.split('/')
  if (segments.length > 3) {
    return '/' + segments.slice(1, 3).join('/')
  }
  return path
})

function handleLogout() {
  authStore.logout()
  router.push('/admin/login')
}
</script>

<style scoped lang="scss">
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 220px;
  background: #1A1A1A;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 20px;
  .sidebar-logo { color: #FFD700; font-size: 18px; font-weight: 700; }
}

.sidebar .el-menu { border-right: none; }

.admin-main {
  flex: 1;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.admin-header {
  background: #fff;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.admin-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  .admin-user { color: #666; font-size: 14px; }
}

.admin-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
</style>
