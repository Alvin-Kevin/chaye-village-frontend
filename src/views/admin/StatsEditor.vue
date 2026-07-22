<template>
  <div class="stats-editor-page">
    <h2 class="page-title">数据统计编辑</h2>

    <el-table :data="list" v-loading="loading" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="statKey" label="键" width="120" />
      <el-table-column prop="statLabel" label="标签" min-width="120" />
      <el-table-column prop="statValue" label="数值" width="100" />
      <el-table-column prop="statUnit" label="单位" width="80" />
      <el-table-column label="操作" width="100" align="center">
        <template #default="{ row }">
          <el-button size="small" type="primary" link @click="openEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      title="编辑统计数据"
      width="560px"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标签" prop="statLabel">
          <el-input v-model="form.statLabel" placeholder="请输入标签" />
        </el-form-item>
        <el-form-item label="数值" prop="statValue">
          <el-input v-model="form.statValue" placeholder="请输入数值" />
        </el-form-item>
        <el-form-item label="单位" prop="statUnit">
          <el-input v-model="form.statUnit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="图表数据" prop="chartData">
          <el-input
            v-model="form.chartData"
            type="textarea"
            :rows="6"
            placeholder="请输入JSON格式的图表数据"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { DashboardStat } from '@/types'
import request from '@/api/request'

const list = ref<DashboardStat[]>([])
const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const editKey = ref<string>('')
const formRef = ref<FormInstance>()

const form = reactive({
  statLabel: '',
  statValue: '',
  statUnit: '',
  chartData: '',
})

const rules: FormRules = {
  statLabel: [{ required: true, message: '请输入标签', trigger: 'blur' }],
}

async function fetchList() {
  loading.value = true
  try {
    const res = await request.get('/admin/dashboard/stats')
    list.value = res ?? []
  } catch {
    ElMessage.error('获取统计数据失败')
  } finally {
    loading.value = false
  }
}

function openEdit(row: DashboardStat) {
  editKey.value = row.statKey
  form.statLabel = row.statLabel
  form.statValue = row.statValue
  form.statUnit = row.statUnit
  form.chartData = row.chartData ?? ''
  dialogVisible.value = true
}

function resetForm() {
  formRef.value?.resetFields()
  form.statLabel = ''
  form.statValue = ''
  form.statUnit = ''
  form.chartData = ''
  editKey.value = ''
}

async function handleSubmit() {
  if (!formRef.value || !editKey.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    await request.put(`/admin/dashboard/stats/${editKey.value}`, {
      statLabel: form.statLabel,
      statValue: form.statValue,
      statUnit: form.statUnit,
      chartData: form.chartData,
    })
    ElMessage.success('更新成功')
    dialogVisible.value = false
    fetchList()
  } catch {
    ElMessage.error('更新失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="scss">
.page-title {
  font-size: 20px;
  color: #333;
  margin-bottom: 16px;
}
</style>
