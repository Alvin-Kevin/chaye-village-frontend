<template>
  <div class="yi-culture-page">
    <div class="yi-pattern-bar"></div>

    <!-- Hero 区域 -->
    <section class="hero-section">
      <div class="hero-overlay">
        <div class="content-wrapper hero-content">
          <h1 class="hero-title">彝文化瑰宝</h1>
          <p class="hero-desc">
            彝族，一个拥有千年文明与独特审美的民族。火把节的热烈、彝绣的精美、漆器的古朴、
            银饰的华贵，构成了丰富多彩的彝族文化画卷。茶叶村地处马边彝族自治县，
            世代传承着深厚的彝族文化底蕴。
          </p>
          <div class="hero-patterns">
            <span class="pattern-item">火把节</span>
            <span class="pattern-divider">|</span>
            <span class="pattern-item">彝绣</span>
            <span class="pattern-divider">|</span>
            <span class="pattern-item">漆器</span>
            <span class="pattern-divider">|</span>
            <span class="pattern-item">银饰</span>
            <span class="pattern-divider">|</span>
            <span class="pattern-item">彝家美食</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 文化文章 -->
    <div class="content-wrapper page-container">
      <h2 class="section-title">彝文化专题</h2>
      <p class="section-desc">探索深厚的彝族文化，感受非遗传承之美</p>

      <div class="card-grid">
        <el-card
          v-for="article in articles"
          :key="article.id"
          shadow="hover"
          class="article-card"
          @click="$router.push(`/articles/${article.id}`)"
        >
          <img :src="article.coverImage" :alt="article.title" class="cover-img" />
          <div class="card-info">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-summary">{{ article.summary }}</p>
            <div class="article-meta">
              <span class="meta-date">{{ formatDate(article.publishedAt) }}</span>
              <span class="meta-views">
                <el-icon><View /></el-icon> {{ article.viewCount }}
              </span>
            </div>
          </div>
        </el-card>
      </div>

      <el-empty v-if="!loading && articles.length === 0" description="暂无彝文化文章" />
    </div>
    <div class="yi-pattern-bar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { View } from '@element-plus/icons-vue'
import { articleApi } from '@/api/article'
import type { Article } from '@/types'

const articles = ref<Article[]>([])
const loading = ref(false)

const formatDate = (dateStr: string): string => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await articleApi.getList({ categoryCode: 'yi_culture' })
    articles.value = res.records
  } catch (e) {
    /* 后端未启动时静默 */
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.yi-culture-page {
  background: #F5F0EB;
}

// Hero
.hero-section {
  background: linear-gradient(135deg, #1A1A1A 0%, #2C1A1A 40%, #C41E1E 100%);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 40px,
      rgba(255, 215, 0, 0.03) 40px,
      rgba(255, 215, 0, 0.03) 42px
    );
  }
}

.hero-overlay {
  padding: 80px 0;
}

.hero-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 42px;
  font-weight: 800;
  color: #FFD700;
  margin-bottom: 20px;
  letter-spacing: 4px;
}

.hero-desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
  max-width: 720px;
  margin: 0 auto 28px;
}

.hero-patterns {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  .pattern-item {
    color: #FFD700;
    font-size: 16px;
    font-weight: 500;
  }

  .pattern-divider {
    color: rgba(255, 255, 255, 0.3);
  }
}

// Section
.section-title {
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  color: #1A1A1A;
  margin-bottom: 8px;
}

.section-desc {
  text-align: center;
  color: #666;
  font-size: 16px;
  margin-bottom: 32px;
}

// Cards
.article-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 12px;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(196, 30, 30, 0.12);
  }

  .cover-img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .card-info {
    padding: 4px 0;
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
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: #999;

    .meta-views {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
}

// 页容器
.page-container {
  min-height: auto;
  padding: 48px 0 32px;
}
</style>
