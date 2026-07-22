<template>
  <div class="spots-page">
    <div class="toolbar">
      <h2 class="page-title">景点管理</h2>
      <el-button type="primary" @click="$router.push('/admin/spots/create')">新增景点</el-button>
    </div>

    <el-table :data="list" v-loading="loading" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="名称" min-width="120" />
      <el-table-column prop="tags" label="标签" width="160">
        <template #default="{ row }">
          <el-tag v-for="tag in (row.tags ?? '').split(',').filter(Boolean)" :key="tag" size="small" style="margin-right: 4px">
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>
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
          <el-button size="small" type="primary" link @click="$router.push(`/admin/spots/${row.id}/edit`)">编辑</el-button>
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
import type { Spot } from '@/types'
import request from '@/api/request'

const list = ref<Spot[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

async function fetchList() {
  loading.value = true
  try {
    const res = await request.get('/admin/spots', { params: { page: currentPage.value, size: pageSize.value } })
    list.value = res?.records ?? []
    total.value = res?.total ?? 0
  } catch {
    ElMessage.error('获取景点列表失败')
  } finally {
    loading.value = false
  }
}

async function toggleStatus(row: Spot) {
  try {
    await request.put(`/admin/spots/${row.id}/status`, { status: row.status === 1 ? 0 : 1 })
    ElMessage.success('状态更新成功')
    fetchList()
  } catch {
    ElMessage.error('状态更新失败')
  }
}

async function handleDelete(row: Spot) {
  try {
    await ElMessageBox.confirm(`确认删除景点 "${row.name}"？`, '删除确认', { type: 'warning' })
    await request.delete(`/admin/spots/${row.id}`)
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

.page-title {
  font-size: 20px;
  color: #333;
  margin: 0;
}
</style>
