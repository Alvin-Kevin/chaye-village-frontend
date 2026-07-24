<template>
  <div class="home-page">
    <div class="yi-pattern-bar"></div>
    <section class="hero">
      <el-carousel height="500px" :interval="5000" arrow="always">
        <el-carousel-item v-for="b in banners" :key="b.id">
          <div class="hero-slide" :style="{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${b.imageUrl})` }">
            <div class="hero-text">
              <h1>{{ b.title }}</h1>
              <p>{{ b.subtitle }}</p>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>

    <section class="intro-section content-wrapper">
      <h2 class="section-title">走进茶叶村</h2>
      <p class="section-desc">马边彝族自治县茶叶村，高山云雾出好茶，彝乡风情迎客来</p>
      <div class="module-cards">
        <div class="module-card" v-for="m in modules" :key="m.path" @click="$router.push(m.path)">
          <el-icon :size="40"><component :is="m.icon" /></el-icon>
          <h3>{{ m.title }}</h3>
          <p>{{ m.desc }}</p>
        </div>
      </div>
    </section>

    <section class="featured-section content-wrapper">
      <h2 class="section-title">推荐特产</h2>
      <div class="card-grid">
        <el-card v-for="p in products" :key="p.id" shadow="hover" @click="$router.push(`/products/${p.id}`)">
          <img :src="p.coverImage" class="product-img" />
          <h4>{{ p.name }}</h4>
          <p class="summary">{{ p.summary }}</p>
          <span class="price">参考价: ¥{{ p.priceRef }}/{{ p.unit }}</span>
        </el-card>
      </div>
    </section>
    <div class="yi-pattern-bar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { bannerApi } from '@/api/banner'
import { productApi } from '@/api/product'
import type { Banner, Product } from '@/types'

const banners = ref<Banner[]>([])
const products = ref<Product[]>([])

const modules = [
  { path: '/village', icon: 'HomeFilled', title: '村庄概况', desc: '了解茶叶村的自然地理与人文历史' },
  { path: '/products', icon: 'Goods', title: '茶叶特产', desc: '马边高山茶系列产品展示' },
  { path: '/spots', icon: 'Location', title: '文旅景点', desc: '茶园风光、文化遗址与自然景观' },
  { path: '/yi-culture', icon: 'Star', title: '彝文化', desc: '火把节、彝绣、彝家美食等文化瑰宝' },
  { path: '/articles', icon: 'Notebook', title: '新闻资讯', desc: '村务动态、旅游攻略与调研见闻' },
  { path: '/dashboard', icon: 'TrendCharts', title: '数据大屏', desc: '可视化展示茶叶村发展数据' },
]

onMounted(async () => {
  try {
    const [bData, pData] = await Promise.all([bannerApi.getList(), productApi.getFeatured()])
    banners.value = bData
    products.value = pData
  } catch (e) { /* 后端未启动时静默 */ }
})
</script>

<style scoped lang="scss">
.hero-slide {
  height: 100%; display: flex; align-items: center; justify-content: center;
  background-size: cover; background-position: center;
}
.hero-text { text-align: center; color: #fff;
  h1 { font-size: 48px; font-weight: 700; text-shadow: 0 2px 8px rgba(0,0,0,0.5); }
  p { font-size: 18px; margin-top: 12px; opacity: 0.9; }
}
.section-title { font-size: 28px; font-weight: 700; text-align: center; color: #1A1A1A; margin: 48px 0 8px; }
.section-desc { text-align: center; color: #666; margin-bottom: 32px; }
.module-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.module-card { background: #fff; padding: 32px 20px; border-radius: 12px; text-align: center;
  cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
  &:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
  .el-icon { color: #C41E1E; margin-bottom: 12px; }
  h3 { font-size: 18px; margin-bottom: 8px; }
  p { color: #999; font-size: 14px; }
}
.featured-section { margin-bottom: 48px; }
.product-img { width: 100%; height: 180px; object-fit: contain; background: #f5f5f5; border-radius: 8px; margin-bottom: 12px; }
.summary { color: #666; font-size: 14px; margin: 8px 0; }
.price { color: #C41E1E; font-weight: 600; }
@media (max-width: 768px) {
  .module-cards { grid-template-columns: 1fr; }
  .hero-text h1 { font-size: 32px; }
}
</style>
