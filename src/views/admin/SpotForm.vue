<template>
  <div class="spot-form-page">
    <h2 class="page-title">{{ isEdit ? '编辑景点' : '新增景点' }}</h2>

    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="form-wrap">
      <el-form-item label="景点名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入景点名称" />
      </el-form-item>

      <el-form-item label="简介" prop="summary">
        <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="请输入景点简介" />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="6" placeholder="请输入详细描述" />
      </el-form-item>

      <el-form-item label="封面图片" prop="coverImage">
        <el-input v-model="form.coverImage" placeholder="请输入图片URL" />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="标签" prop="tags">
            <el-input v-model="form.tags" placeholder="多个标签以逗号分隔" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sortOrder">
            <el-input-number v-model="form.sortOrder" :min="0" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import request from '@/api/request'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const submitting = ref(false)

const isEdit = ref(false)
const editId = ref<number | null>(null)

const form = reactive({
  name: '',
  summary: '',
  description: '',
  coverImage: '',
  tags: '',
  sortOrder: 0,
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入景点名称', trigger: 'blur' }],
}

async function loadSpot(id: number) {
  try {
    const res = await request.get(`/admin/spots/${id}`)
    if (res) {
      form.name = res.name
      form.summary = res.summary ?? ''
      form.description = res.description ?? ''
      form.coverImage = res.coverImage ?? ''
      form.tags = res.tags ?? ''
      form.sortOrder = res.sortOrder
    }
  } catch {
    ElMessage.error('获取景点信息失败')
  }
}

async function handleSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    if (isEdit.value && editId.value) {
      await request.put(`/admin/spots/${editId.value}`, form)
      ElMessage.success('更新成功')
    } else {
      await request.post('/admin/spots', form)
      ElMessage.success('创建成功')
    }
    router.back()
  } catch {
    ElMessage.error('操作失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  const id = route.params.id
  if (id && typeof id === 'string') {
    isEdit.value = true
    editId.value = parseInt(id)
    loadSpot(editId.value)
  }
})
</script>

<style scoped lang="scss">
.page-title {
  font-size: 20px;
  color: #333;
  margin-bottom: 24px;
}

.form-wrap {
  max-width: 800px;
}
</style>
