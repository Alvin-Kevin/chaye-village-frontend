<template>
  <div class="dashboard-page">
    <div class="yi-pattern-bar"></div>
    <div class="content-wrapper page-container">
      <h1 class="page-title">数据大屏</h1>
      <p class="page-subtitle">基于2026年7月实地调研 · 茶叶村发展数据可视化</p>

      <div class="stats-cards">
        <div v-for="stat in stats" :key="stat.id" class="stat-card">
          <div class="stat-value">
            <span class="value-num">{{ stat.statValue }}</span>
            <span class="value-unit" v-if="stat.statUnit">{{ stat.statUnit }}</span>
          </div>
          <div class="stat-label">{{ stat.statLabel }}</div>
        </div>
      </div>

      <div v-if="!loading && stats.length > 0" class="charts-grid">
        <ChartWrapper
          v-for="chart in chartOptions"
          :key="chart.key"
          :title="chart.title"
          :option="chart.option"
          class="chart-item"
        />
      </div>
      <el-empty v-if="!loading && stats.length === 0" description="暂无统计数据" />
    </div>
    <div class="yi-pattern-bar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { statsApi } from '@/api/stats'
import type { DashboardStat } from '@/types'
import ChartWrapper from '@/components/ChartWrapper.vue'

const stats = ref<DashboardStat[]>([])
const loading = ref(false)

const COMMON_COLORS = ['#C41E1E', '#FFD700', '#1A1A1A', '#2D5A27', '#8B4513', '#CD853F']

function buildOption(stat: DashboardStat) {
  try {
    const raw = JSON.parse(stat.chartData)
    const baseOption: any = {
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      color: COMMON_COLORS,
    }

    if (stat.chartType === 'bar') {
      return {
        ...baseOption,
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: raw.categories || [], axisLabel: { color: '#666' } },
        yAxis: { type: 'value', axisLabel: { color: '#666' } },
        series: (raw.series || []).map((s: any) => ({ ...s, type: 'bar', barMaxWidth: 50 }))
      }
    } else if (stat.chartType === 'line') {
      return {
        ...baseOption,
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: raw.categories || [], axisLabel: { color: '#666' }, boundaryGap: false },
        yAxis: { type: 'value', axisLabel: { color: '#666' } },
        series: (raw.series || []).map((s: any) => ({ ...s, type: 'line', smooth: true }))
      }
    } else if (stat.chartType === 'pie') {
      return {
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        color: ['#C41E1E', '#2D5A27', '#FFD700', '#8B4513', '#1A1A1A', '#CD853F'],
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          label: { formatter: '{b}\n{d}%', color: '#666' },
          emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } },
          data: raw.series?.[0]?.data || raw.data || []
        }]
      }
    } else if (stat.chartType === 'radar') {
      const indicators = (raw.indicators || []).map((name: string) => ({ name, max: 100 }))
      return {
        tooltip: {},
        radar: { indicator: indicators, center: ['50%', '50%'], radius: '60%' },
        series: [{
          type: 'radar',
          data: raw.series || [],
          areaStyle: { opacity: 0.15 }
        }]
      }
    }
  } catch {
    return null
  }
  return null
}

const chartOptions = computed(() => {
  return stats.value
    .filter(s => s.chartType && s.chartData)
    .map(s => ({ key: s.statKey, title: s.statLabel, option: buildOption(s) }))
    .filter(c => c.option !== null)
})

onMounted(async () => {
  loading.value = true
  try {
    stats.value = await statsApi.getAll()
  } catch {
    // 后端未启动时展示占位
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.dashboard-page {
  background: #F5F0EB;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: linear-gradient(135deg, #FFF 0%, #FFFBF0 100%);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 28px 24px;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(196, 30, 30, 0.08);
  }
}

.stat-value {
  margin-bottom: 10px;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;

  .value-num {
    font-size: 36px;
    font-weight: 800;
    color: #C41E1E;
    line-height: 1;
  }

  .value-unit {
    font-size: 16px;
    color: #999;
    font-weight: 500;
  }
}

.stat-label {
  font-size: 15px;
  color: #666;
  font-weight: 500;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.chart-item {
  &:last-child:nth-child(odd) {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
