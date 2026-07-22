<template>
  <div class="dashboard">
    <h2 class="page-title">工作台</h2>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background: #e6f7ff">
            <el-icon :size="28" color="#1890ff"><Goods /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-label">产品数</div>
            <div class="stat-value">{{ stats.products }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background: #fff7e6">
            <el-icon :size="28" color="#fa8c16"><Notebook /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-label">文章数</div>
            <div class="stat-value">{{ stats.articles }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background: #f6ffed">
            <el-icon :size="28" color="#52c41a"><Location /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-label">景点数</div>
            <div class="stat-value">{{ stats.spots }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background: #fff0f6">
            <el-icon :size="28" color="#eb2f96"><Picture /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-label">Banner数</div>
            <div class="stat-value">{{ stats.banners }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/api/request'

const stats = reactive({
  products: 0,
  articles: 0,
  spots: 0,
  banners: 0,
})

async function fetchStats() {
  try {
    const [productsRes, articlesRes, spotsRes, bannersRes] = await Promise.all([
      request.get('/admin/products?page=1&size=1'),
      request.get('/admin/articles?page=1&size=1'),
      request.get('/admin/spots?page=1&size=1'),
      request.get('/admin/banners?page=1&size=1'),
    ])
    stats.products = productsRes?.total ?? 0
    stats.articles = articlesRes?.total ?? 0
    stats.spots = spotsRes?.total ?? 0
    stats.banners = bannersRes?.total ?? 0
  } catch {
    ElMessage.error('获取统计数据失败')
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped lang="scss">
.dashboard {
  .page-title {
    margin-bottom: 24px;
    font-size: 20px;
    color: #333;
  }
}

.stat-card {
  :deep(.el-card__body) {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px;
  }
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #999;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #333;
}
</style>
