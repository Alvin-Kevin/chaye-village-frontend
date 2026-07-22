<template>
  <div class="spot-detail-page">
    <div class="yi-pattern-bar"></div>
    <div class="content-wrapper page-container">
      <!-- 返回按钮 -->
      <el-button text @click="$router.back()" class="back-btn">
        <el-icon><ArrowLeft /></el-icon> 返回列表
      </el-button>

      <div v-if="spot" class="detail-content">
        <!-- 封面图 -->
        <div class="cover-section">
          <img :src="spot.coverImage" :alt="spot.name" class="cover-img" />
        </div>

        <!-- 景点信息 -->
        <div class="info-section">
          <h1 class="spot-name">{{ spot.name }}</h1>
          <div class="tags-row">
            <el-tag
              v-for="tag in parseTags(spot.tags)"
              :key="tag"
              size="large"
              class="spot-tag"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>

        <!-- 景点描述 -->
        <div class="desc-section">
          <h2 class="section-title">景点介绍</h2>
          <div class="desc-content" v-html="spot.description"></div>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty v-if="!loading && !spot" description="景点不存在" />
    </div>
    <div class="yi-pattern-bar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { spotApi } from '@/api/spot'
import type { Spot } from '@/types'

const route = useRoute()
const spot = ref<Spot | null>(null)
const loading = ref(false)

const parseTags = (tags: string): string[] => {
  if (!tags) return []
  return tags.split(',').map(t => t.trim()).filter(Boolean)
}

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id) return
  loading.value = true
  try {
    spot.value = await spotApi.getDetail(id)
  } catch (e) {
    /* 后端未启动时静默 */
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.spot-detail-page {
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

.cover-section {
  .cover-img {
    width: 100%;
    max-height: 480px;
    object-fit: cover;
  }
}

.info-section {
  padding: 32px 40px;
  border-bottom: 1px solid #f0f0f0;

  .spot-name {
    font-size: 28px;
    font-weight: 700;
    color: #1A1A1A;
    margin-bottom: 20px;
  }

  .tags-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .spot-tag {
    background: rgba(196, 30, 30, 0.08);
    border-color: rgba(196, 30, 30, 0.2);
    color: #C41E1E;
    padding: 4px 16px;
  }
}

.desc-section {
  padding: 32px 40px 48px;

  .section-title {
    font-size: 20px;
    font-weight: 600;
    color: #1A1A1A;
    margin-bottom: 20px;
    padding-left: 12px;
    border-left: 3px solid #C41E1E;
  }

  .desc-content {
    color: #444;
    line-height: 1.8;
    font-size: 15px;

    :deep(img) {
      max-width: 100%;
      border-radius: 8px;
      margin: 16px 0;
    }
  }
}
</style>
