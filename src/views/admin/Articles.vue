<template>
  <div class="articles-page">
    <div class="toolbar">
      <div class="toolbar-left">
        <h2 class="page-title">文章管理</h2>
        <el-select v-model="filterCategoryId" placeholder="按分类筛选" clearable @change="fetchList" style="width: 160px">
          <el-option
            v-for="cat in categories"
            :key="cat.id"
            :label="cat.name"
            :value="cat.id"
          />
        </el-select>
      </div>
      <el-button type="primary" @click="$router.push('/admin/articles/create')">新增文章</el-button>
    </div>

    <el-table :data="list" v-loading="loading" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="title" label="标题" min-width="160" />
      <el-table-column prop="categoryName" label="分类" width="100" />
      <el-table-column prop="author" label="作者" width="100" />
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
            {{ row.status === 1 ? '已发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="publishedAt" label="发布时间" width="160" />
      <el-table-column label="操作" width="320" align="center">
        <template #default="{ row }">
          <el-button size="small" type="primary" link @click="$router.push(`/admin/articles/${row.id}/edit`)">编辑</el-button>
          <el-button
            size="small"
            :type="row.status === 1 ? 'warning' : 'success'"
            link
            @click="togglePublish(row)"
          >
            {{ row.status === 1 ? '下架' : '发布' }}
          </el-button>
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
import type { Article, ArticleCategory } from '@/types'
import request from '@/api/request'

const list = ref<Article[]>([])
const categories = ref<ArticleCategory[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const filterCategoryId = ref<number | ''>('')

async function fetchList() {
  loading.value = true
  try {
    const params: Record<string, unknown> = { page: currentPage.value, size: pageSize.value }
    if (filterCategoryId.value !== '') params.categoryId = filterCategoryId.value
    const res = await request.get('/admin/articles', { params })
    list.value = res?.records ?? []
    total.value = res?.total ?? 0
  } catch {
    ElMessage.error('获取文章列表失败')
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  try {
    const res = await request.get('/admin/articles/categories')
    categories.value = res ?? []
  } catch {
    // non-critical
  }
}

async function togglePublish(row: Article) {
  try {
    const newStatus = row.status === 1 ? 0 : 1
    await request.put(`/admin/articles/${row.id}/status`, { status: newStatus })
    ElMessage.success(newStatus === 1 ? '已发布' : '已下架')
    fetchList()
  } catch {
    ElMessage.error('操作失败')
  }
}

async function handleDelete(row: Article) {
  try {
    await ElMessageBox.confirm(`确认删除文章 "${row.title}"？`, '删除确认', { type: 'warning' })
    await request.delete(`/admin/articles/${row.id}`)
    ElMessage.success('删除成功')
    fetchList()
  } catch {
    // cancelled
  }
}

onMounted(() => {
  fetchCategories()
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
