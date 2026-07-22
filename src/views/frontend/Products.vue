<template>
  <div class="products-page">
    <div class="yi-pattern-bar"></div>
    <div class="content-wrapper page-container">
      <h1 class="page-title">茶叶特产</h1>
      <p class="page-subtitle">马边高山云雾茶，彝乡绿色农产品</p>

      <!-- 分类筛选 -->
      <div class="filter-tabs">
        <el-radio-group v-model="activeCategory" size="large" @change="onCategoryChange">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="tea">茶叶</el-radio-button>
          <el-radio-button label="agricultural">农副产品</el-radio-button>
          <el-radio-button label="cultural">彝文创</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 商品网格 -->
      <div class="card-grid">
        <el-card
          v-for="product in products"
          :key="product.id"
          shadow="hover"
          class="product-card"
          @click="$router.push(`/products/${product.id}`)"
        >
          <img :src="product.coverImage" :alt="product.name" class="cover-img" />
          <div class="card-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-summary">{{ product.summary }}</p>
            <span class="product-price">参考价: ¥{{ product.priceRef }}/{{ product.unit }}</span>
          </div>
        </el-card>
      </div>

      <!-- 空状态 -->
      <el-empty v-if="!loading && products.length === 0" description="暂无商品" />
    </div>
    <div class="yi-pattern-bar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productApi } from '@/api/product'
import type { Product } from '@/types'

const products = ref<Product[]>([])
const activeCategory = ref('')
const loading = ref(false)

const fetchProducts = async () => {
  loading.value = true
  try {
    const params: { category?: string } = {}
    if (activeCategory.value) {
      params.category = activeCategory.value
    }
    const res = await productApi.getList(params)
    products.value = res.records
  } catch (e) {
    /* 后端未启动时静默 */
  } finally {
    loading.value = false
  }
}

const onCategoryChange = () => {
  fetchProducts()
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped lang="scss">
.products-page {
  background: #F5F0EB;
}

.filter-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;

  :deep(.el-radio-button__inner) {
    border-color: #C41E1E;
    color: #C41E1E;
  }
  :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
    background: #C41E1E;
    border-color: #C41E1E;
    color: #fff;
  }
}

.product-card {
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

  .product-name {
    font-size: 18px;
    font-weight: 600;
    color: #1A1A1A;
    margin-bottom: 8px;
  }

  .product-summary {
    font-size: 14px;
    color: #666;
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .product-price {
    font-size: 16px;
    color: #C41E1E;
    font-weight: 700;
  }
}
</style>
