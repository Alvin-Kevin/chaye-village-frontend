<template>
  <div class="articles-page">
    <div class="yi-pattern-bar"></div>
    <div class="content-wrapper page-container">
      <h1 class="page-title">新闻资讯</h1>
      <p class="page-subtitle">村务动态、旅游攻略与调研见闻</p>

      <div class="articles-layout">
        <!-- 左侧分类筛选 -->
        <aside class="category-sidebar">
          <h3 class="sidebar-title">文章分类</h3>
          <ul class="category-list">
            <li
              v-for="cat in categories"
              :key="cat.id"
              :class="['category-item', { active: activeCategory === cat.code }]"
              @click="onCategorySelect(cat.code)"
            >
              {{ cat.name }}
            </li>
          </ul>
        </aside>

        <!-- 右侧文章列表 -->
        <div class="articles-main">
          <el-card
            v-for="article in articles"
            :key="article.id"
            shadow="hover"
            class="article-card"
            @click="$router.push(`/articles/${article.id}`)"
          >
            <div class="card-layout">
              <img :src="article.coverImage" :alt="article.title" class="card-cover" />
              <div class="card-body">
                <h2 class="article-title">{{ article.title }}</h2>
                <p class="article-summary">{{ article.summary }}</p>
                <div class="article-meta">
                  <span class="meta-date">{{ formatDate(article.publishedAt) }}</span>
                  <span class="meta-views">
                    <el-icon><View /></el-icon> {{ article.viewCount }}
                  </span>
                </div>
              </div>
            </div>
          </el-card>

          <el-empty v-if="!loading && articles.length === 0" description="暂无文章" />

          <!-- 分页 -->
          <div v-if="total > 0" class="pagination-box">
            <el-pagination
              v-model:current-page="currentPage"
              :page-size="pageSize"
              :total="total"
              background
              layout="prev, pager, next"
              @current-change="onPageChange"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="yi-pattern-bar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { View } from '@element-plus/icons-vue'
import { articleApi } from '@/api/article'
import type { Article, ArticleCategory } from '@/types'

const articles = ref<Article[]>([])
const categories = ref<ArticleCategory[]>([])
const activeCategory = ref('')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const formatDate = (dateStr: string): string => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

const fetchArticles = async () => {
  loading.value = true
  try {
    const params: { categoryCode?: string; page: number; size: number } = {
      page: currentPage.value,
      size: pageSize.value
    }
    if (activeCategory.value) {
      params.categoryCode = activeCategory.value
    }
    const res = await articleApi.getList(params)
    articles.value = res.records
    total.value = res.total
  } catch (e) {
    /* 后端未启动时静默 */
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    categories.value = await articleApi.getCategories()
  } catch (e) {
    /* 后端未启动时静默 */
  }
}

const onCategorySelect = (code: string) => {
  activeCategory.value = code
  currentPage.value = 1
  fetchArticles()
}

const onPageChange = () => {
  fetchArticles()
}

onMounted(() => {
  fetchCategories()
  fetchArticles()
})
</script>

<style scoped lang="scss">
.articles-page {
  background: #F5F0EB;
}

.articles-layout {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

// 侧边栏
.category-sidebar {
  width: 200px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  position: sticky;
  top: 24px;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #FFD700;
}

.category-list {
  list-style: none;
}

.category-item {
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  color: #666;
  transition: all 0.2s;

  &:hover {
    background: rgba(196, 30, 30, 0.06);
    color: #C41E1E;
  }

  &.active {
    background: #C41E1E;
    color: #fff;
    font-weight: 500;
  }
}

// 文章主区域
.articles-main {
  flex: 1;
  min-width: 0;
}

.article-card {
  margin-bottom: 16px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 12px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(196, 30, 30, 0.1);
  }

  :deep(.el-card__body) {
    padding: 0;
  }
}

.card-layout {
  display: flex;
}

.card-cover {
  width: 240px;
  height: 160px;
  object-fit: cover;
  flex-shrink: 0;
  border-radius: 12px 0 0 12px;
}

.card-body {
  padding: 20px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.article-title {
  font-size: 18px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-summary {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #999;

  .meta-views {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.pagination-box {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

// 响应式
@media (max-width: 768px) {
  .articles-layout {
    flex-direction: column;
  }
  .category-sidebar {
    width: 100%;
    position: static;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    overflow-x: auto;

    .sidebar-title { margin-bottom: 0; padding-bottom: 0; border-bottom: none; white-space: nowrap; }
    .category-list { display: flex; gap: 8px; }
    .category-item { white-space: nowrap; }
  }
  .card-layout { flex-direction: column; }
  .card-cover { width: 100%; height: 180px; border-radius: 12px 12px 0 0; }
}
</style>
