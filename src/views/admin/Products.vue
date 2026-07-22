<template>
  <div class="products-page">
    <div class="toolbar">
      <div class="toolbar-left">
        <h2 class="page-title">产品管理</h2>
        <el-select v-model="filterCategory" placeholder="按分类筛选" clearable @change="fetchList" style="width: 160px">
          <el-option label="茶叶" value="tea" />
          <el-option label="农副产品" value="agricultural" />
          <el-option label="彝文创" value="cultural" />
        </el-select>
      </div>
      <el-button type="primary" @click="$router.push('/admin/products/create')">新增产品</el-button>
    </div>

    <el-table :data="list" v-loading="loading" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="名称" min-width="120" />
      <el-table-column prop="category" label="分类" width="100" />
      <el-table-column prop="priceRef" label="参考价" width="100" />
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-switch
            :model-value="row.status === 1"
            @change="toggleStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260" align="center">
        <template #default="{ row }">
          <el-button size="small" type="primary" link @click="$router.push(`/admin/products/${row.id}/edit`)">编辑</el-button>
          <el-button size="small" type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="total > 0"
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next"
      @current-change="fetchList"
      style="margin-top: 16px; justify-content: flex-end"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Product } from '@/types'
import request from '@/api/request'

const list = ref<Product[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const filterCategory = ref('')

async function fetchList() {
  loading.value = true
  try {
    const params: Record<string, unknown> = { page: currentPage.value, size: pageSize.value }
    if (filterCategory.value) params.category = filterCategory.value
    const res = await request.get('/admin/products', { params })
    list.value = res?.records ?? []
    total.value = res?.total ?? 0
  } catch {
    ElMessage.error('获取产品列表失败')
  } finally {
    loading.value = false
  }
}

async function toggleStatus(row: Product) {
  try {
    await request.put(`/admin/products/${row.id}/status`, { status: row.status === 1 ? 0 : 1 })
    ElMessage.success('状态更新成功')
    fetchList()
  } catch {
    ElMessage.error('状态更新失败')
  }
}

async function handleDelete(row: Product) {
  try {
    await ElMessageBox.confirm(`确认删除产品 "${row.name}"？`, '删除确认', { type: 'warning' })
    await request.delete(`/admin/products/${row.id}`)
    ElMessage.success('删除成功')
    fetchList()
  } catch {
    // cancelled
  }
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="scss">
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title {
  font-size: 20px;
  color: #333;
  margin: 0;
}
</style>
