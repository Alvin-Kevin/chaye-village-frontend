<template>
  <div class="page-container">
    <div class="content-wrapper">
      <h1 class="page-title">村庄概况</h1>
      <p class="page-subtitle">马边彝族自治县茶叶村</p>
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane v-for="info in villageInfos" :key="info.section" :label="info.title" :name="info.section">
          <div class="village-content" v-html="info.content"></div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { villageApi } from '@/api/village'
import type { VillageInfo } from '@/types'

const activeTab = ref('intro')
const villageInfos = ref<VillageInfo[]>([])

onMounted(async () => {
  try {
    villageInfos.value = await villageApi.getAll()
    if (villageInfos.value.length > 0) activeTab.value = villageInfos.value[0].section
  } catch (e) { /* placeholder */ }
})
</script>

<style scoped>
.village-content { padding: 20px; line-height: 1.8; }
.village-content :deep(p) { margin-bottom: 12px; text-indent: 2em; }
</style>
