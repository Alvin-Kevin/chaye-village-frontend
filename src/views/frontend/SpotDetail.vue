<template>
  <div class="spot-detail-page">
    <div class="yi-pattern-bar"></div>
    <div class="content-wrapper page-container">
      <!-- 返回按钮 -->
      <el-button text @click="$router.back()" class="back-btn">
        <el-icon><ArrowLeft /></el-icon> 返回列表
      </el-button>

      <div v-if="spot" class="detail-content">
        <!-- 图片画廊 -->
        <div class="cover-section">
          <div class="cover-bg" :style="{ backgroundImage: `url(${allImages[currentSlideIndex] || spot.coverImage})` }"></div>

          <template v-if="allImages.length > 1">
            <el-carousel
              :interval="4000"
              arrow="always"
              indicator-position="none"
              height="480px"
              @change="onSlideChange"
            >
              <el-carousel-item v-for="(img, idx) in allImages" :key="idx">
                <img :src="img" :alt="spot.name" class="cover-img" @click="openViewer(currentSlideIndex)" />
              </el-carousel-item>
            </el-carousel>
            <div class="gallery-counter" @click="openViewer(currentSlideIndex)">{{ currentSlide }} / {{ allImages.length }}</div>
          </template>
          <img v-else :src="spot.coverImage" :alt="spot.name" class="cover-img" @click="openViewer(0)" />
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

    <ImageViewer
      :visible="viewerVisible"
      :images="allImages"
      :initial-index="viewerIndex"
      @close="viewerVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { spotApi } from '@/api/spot'
import ImageViewer from '@/components/ImageViewer.vue'
import type { Spot } from '@/types'

const route = useRoute()
const spot = ref<Spot | null>(null)
const loading = ref(false)
const currentSlideIndex = ref(0)
const viewerVisible = ref(false)
const viewerIndex = ref(0)

const parseTags = (tags: string): string[] => {
  if (!tags) return []
  return tags.split(',').map(t => t.trim()).filter(Boolean)
}

const currentSlide = computed(() => currentSlideIndex.value + 1)

function parseImages(imagesStr: string): string[] {
  if (!imagesStr) return []
  try {
    const arr = JSON.parse(imagesStr)
    return Array.isArray(arr) ? arr : []
  } catch { return [] }
}

const allImages = computed(() => {
  if (!spot.value) return []
  const list: string[] = []
  if (spot.value.coverImage) list.push(spot.value.coverImage)
  const extras = parseImages(spot.value.images)
  return [...list, ...extras]
})

function onSlideChange(index: number) {
  currentSlideIndex.value = index
}

function openViewer(index: number) {
  viewerIndex.value = index
  viewerVisible.value = true
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
  position: relative;
  overflow: hidden;

  .cover-bg {
    position: absolute;
    top: -12px; left: -12px; right: -12px; bottom: -12px;
    background-size: cover;
    background-position: center;
    filter: blur(30px);
    opacity: 0.55;
    transition: background-image 0.4s ease;
  }

  .cover-img {
    position: relative;
    z-index: 1;
    width: 100%;
    max-height: 480px;
    object-fit: contain;
    cursor: pointer;
  }

  :deep(.el-carousel) {
    position: relative;
    z-index: 1;
  }

  .gallery-counter {
    position: absolute;
    bottom: 12px;
    right: 16px;
    z-index: 2;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 13px;
    cursor: pointer;
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
