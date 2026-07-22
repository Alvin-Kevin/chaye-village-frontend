<template>
  <div class="chart-wrapper" v-loading="loading">
    <div class="chart-header" v-if="title">
      <h3>{{ title }}</h3>
    </div>
    <div class="chart-body" ref="chartRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  title?: string
  option: any
  loading?: boolean
}>()

const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return
  if (chartInstance) {
    chartInstance.dispose()
  }
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(props.option)
}

function handleResize() {
  chartInstance?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

watch(() => props.option, () => {
  if (chartInstance) {
    chartInstance.setOption(props.option, true)
  }
}, { deep: true })

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped>
.chart-wrapper {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}
.chart-header {
  margin-bottom: 16px;
}
.chart-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1A1A1A;
}
.chart-body {
  width: 100%;
  height: 360px;
}
</style>
