<template>
  <div class="product-detail-page">
    <div class="yi-pattern-bar"></div>
    <div class="content-wrapper page-container">
      <!-- 返回按钮 -->
      <el-button text @click="$router.back()" class="back-btn">
        <el-icon><ArrowLeft /></el-icon> 返回列表
      </el-button>

      <div v-if="product" class="detail-content">
        <!-- 图片画廊 -->
        <div class="cover-section">
          <template v-if="allImages.length > 1">
            <el-carousel :interval="4000" arrow="always" indicator-position="none" height="480px">
              <el-carousel-item v-for="(img, idx) in allImages" :key="idx">
                <img :src="img" :alt="product.name" class="cover-img" />
              </el-carousel-item>
            </el-carousel>
            <div class="gallery-counter">{{ currentSlide }} / {{ allImages.length }}</div>
          </template>
          <img v-else :src="product.coverImage" :alt="product.name" class="cover-img" />
        </div>

        <!-- 商品信息 -->
        <div class="info-section">
          <h1 class="product-name">{{ product.name }}</h1>
          <el-tag type="danger" size="large" class="category-tag">{{ categoryLabel }}</el-tag>
          <div class="price-box">
            <span class="price-label">参考价格</span>
            <span class="price-value">¥{{ product.priceRef }}</span>
            <span class="price-unit">/{{ product.unit }}</span>
          </div>
        </div>

        <!-- 商品描述 -->
        <div class="desc-section">
          <h2 class="section-title">商品详情</h2>
          <div class="desc-content" v-html="product.description"></div>
        </div>
      </div>

      <!-- 加载/空状态 -->
      <el-empty v-if="!loading && !product" description="商品不存在" />
    </div>
    <div class="yi-pattern-bar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { productApi } from '@/api/product'
import type { Product } from '@/types'

const route = useRoute()
const product = ref<Product | null>(null)
const loading = ref(false)
const currentSlide = ref(1)

const categoryLabels: Record<string, string> = {
  tea: '茶叶',
  agricultural: '农副产品',
  cultural: '彝文创'
}

const categoryLabel = computed(() => {
  return product.value ? (categoryLabels[product.value.category] || product.value.category) : ''
})

function parseImages(imagesStr: string): string[] {
  if (!imagesStr) return []
  try {
    const arr = JSON.parse(imagesStr)
    return Array.isArray(arr) ? arr : []
  } catch { return [] }
}

const allImages = computed(() => {
  if (!product.value) return []
  const list: string[] = []
  if (product.value.coverImage) list.push(product.value.coverImage)
  const extras = parseImages(product.value.images)
  return [...list, ...extras]
})

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id) return
  loading.value = true
  try {
    product.value = await productApi.getDetail(id)
  } catch (e) {
    /* 后端未启动时静默 */
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.product-detail-page {
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

  .cover-img {
    width: 100%;
    max-height: 480px;
    object-fit: cover;
  }

  .gallery-counter {
    position: absolute;
    bottom: 12px;
    right: 16px;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 13px;
  }
}

.info-section {
  padding: 32px 40px;
  border-bottom: 1px solid #f0f0f0;

  .product-name {
    font-size: 28px;
    font-weight: 700;
    color: #1A1A1A;
    margin-bottom: 16px;
  }

  .category-tag {
    margin-bottom: 20px;
  }

  .price-box {
    background: linear-gradient(135deg, #FFF5F5, #FFFBF0);
    border: 1px solid #FFD700;
    border-radius: 12px;
    padding: 20px 24px;
    display: inline-flex;
    align-items: baseline;
    gap: 8px;

    .price-label {
      font-size: 14px;
      color: #999;
    }

    .price-value {
      font-size: 32px;
      font-weight: 700;
      color: #C41E1E;
    }

    .price-unit {
      font-size: 14px;
      color: #666;
    }
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
