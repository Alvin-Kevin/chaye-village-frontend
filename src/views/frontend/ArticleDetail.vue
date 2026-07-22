<template>
  <div class="article-detail-page">
    <div class="yi-pattern-bar"></div>
    <div class="content-wrapper page-container">
      <!-- 返回按钮 -->
      <el-button text @click="$router.back()" class="back-btn">
        <el-icon><ArrowLeft /></el-icon> 返回列表
      </el-button>

      <div v-if="article" class="detail-content">
        <!-- 文章头部 -->
        <div class="article-header">
          <h1 class="article-title">{{ article.title }}</h1>
          <div class="article-meta">
            <span class="meta-author">
              <el-icon><User /></el-icon> {{ article.author }}
            </span>
            <span class="meta-date">
              <el-icon><Clock /></el-icon> {{ formatDate(article.publishedAt) }}
            </span>
            <span class="meta-views">
              <el-icon><View /></el-icon> {{ article.viewCount }} 次阅读
            </span>
            <el-tag v-if="article.categoryName" size="small" class="category-tag">
              {{ article.categoryName }}
            </el-tag>
          </div>
        </div>

        <!-- 封面图 -->
        <div class="cover-section">
          <img :src="article.coverImage" :alt="article.title" class="cover-img" />
        </div>

        <!-- 文章正文 -->
        <div class="article-body" v-html="article.content"></div>
      </div>

      <!-- 空状态 -->
      <el-empty v-if="!loading && !article" description="文章不存在" />
    </div>
    <div class="yi-pattern-bar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, User, Clock, View } from '@element-plus/icons-vue'
import { articleApi } from '@/api/article'
import type { Article } from '@/types'

const route = useRoute()
const article = ref<Article | null>(null)
const loading = ref(false)

const formatDate = (dateStr: string): string => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id) return
  loading.value = true
  try {
    article.value = await articleApi.getDetail(id)
  } catch (e) {
    /* 后端未启动时静默 */
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.article-detail-page {
  background: #F5F0EB;
}

.back-btn {
  margin-bottom: 24px;
  color: #666;
  &:hover { color: #C41E1E; }
}

.detail-content {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
}

// 文章头部
.article-header {
  padding: 40px 48px 24px;
}

.article-title {
  font-size: 30px;
  font-weight: 700;
  color: #1A1A1A;
  line-height: 1.4;
  margin-bottom: 20px;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  font-size: 14px;
  color: #999;

  .meta-author,
  .meta-date,
  .meta-views {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .category-tag {
    background: rgba(196, 30, 30, 0.08);
    border-color: rgba(196, 30, 30, 0.2);
    color: #C41E1E;
  }
}

// 封面
.cover-section {
  padding: 0 48px;

  .cover-img {
    width: 100%;
    max-height: 480px;
    object-fit: cover;
    border-radius: 12px;
  }
}

// 正文
.article-body {
  padding: 32px 48px 48px;
  color: #333;
  font-size: 16px;
  line-height: 2;
  word-break: break-word;

  :deep(img) {
    max-width: 100%;
    border-radius: 8px;
    margin: 16px 0;
  }

  :deep(h2) {
    font-size: 22px;
    color: #1A1A1A;
    margin: 28px 0 12px;
  }

  :deep(h3) {
    font-size: 18px;
    color: #1A1A1A;
    margin: 24px 0 10px;
  }

  :deep(p) {
    margin-bottom: 14px;
  }

  :deep(blockquote) {
    border-left: 3px solid #C41E1E;
    background: rgba(196, 30, 30, 0.04);
    padding: 12px 20px;
    margin: 16px 0;
    color: #555;
  }
}

@media (max-width: 768px) {
  .article-header { padding: 24px 20px 16px; }
  .article-title { font-size: 24px; }
  .cover-section { padding: 0 20px; }
  .article-body { padding: 20px; }
}
</style>
