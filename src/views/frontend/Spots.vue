<template>
  <div class="spots-page">
    <div class="yi-pattern-bar"></div>
    <div class="content-wrapper page-container">
      <h1 class="page-title">文旅景点</h1>
      <p class="page-subtitle">茶园风光、文化遗址与自然景观</p>

      <!-- 景点卡片网格 -->
      <div class="card-grid">
        <el-card
          v-for="spot in spots"
          :key="spot.id"
          shadow="hover"
          class="spot-card"
          @click="$router.push(`/spots/${spot.id}`)"
        >
          <img :src="spot.coverImage" :alt="spot.name" class="cover-img" />
          <div class="card-info">
            <h3 class="spot-name">{{ spot.name }}</h3>
            <p class="spot-summary">{{ spot.summary }}</p>
            <div class="tags-row">
              <el-tag
                v-for="tag in parseTags(spot.tags)"
                :key="tag"
                size="small"
                class="spot-tag"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 空状态 -->
      <el-empty v-if="!loading && spots.length === 0" description="暂无景点信息" />
    </div>
    <div class="yi-pattern-bar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { spotApi } from '@/api/spot'
import type { Spot } from '@/types'

const spots = ref<Spot[]>([])
const loading = ref(false)

const parseTags = (tags: string): string[] => {
  if (!tags) return []
  return tags.split(',').map(t => t.trim()).filter(Boolean)
}

onMounted(async () => {
  loading.value = true
  try {
    spots.value = await spotApi.getList()
  } catch (e) {
    /* 后端未启动时静默 */
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.spots-page {
  background: #F5F0EB;
}

.spot-card {
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

  .spot-name {
    font-size: 18px;
    font-weight: 600;
    color: #1A1A1A;
    margin-bottom: 8px;
  }

  .spot-summary {
    font-size: 14px;
    color: #666;
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .tags-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .spot-tag {
    background: rgba(196, 30, 30, 0.08);
    border-color: rgba(196, 30, 30, 0.2);
    color: #C41E1E;
  }
}
</style>
