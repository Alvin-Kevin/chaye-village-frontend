<template>
  <div class="product-form-page">
    <h2 class="page-title">{{ isEdit ? '编辑产品' : '新增产品' }}</h2>

    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="form-wrap">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="产品名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入产品名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类" prop="category">
            <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
              <el-option label="茶叶" value="tea" />
              <el-option label="农副产品" value="agricultural" />
              <el-option label="彝文创" value="cultural" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="简介" prop="summary">
        <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="请输入产品简介" />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="6" placeholder="请输入详细描述" />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="参考价" prop="priceRef">
            <el-input-number v-model="form.priceRef" :min="0" :precision="2" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单位" prop="unit">
            <el-input v-model="form.unit" placeholder="如：斤、盒、件" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="排序" prop="sortOrder">
            <el-input-number v-model="form.sortOrder" :min="0" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="封面图片" prop="coverImage">
        <ImageUpload v-model="form.coverImage" />
      </el-form-item>

      <el-form-item label="图片集">
        <MultiImageUpload v-model="form.images" />
      </el-form-item>

      <el-form-item label="首页推荐" prop="isFeatured">
        <el-switch v-model="form.isFeatured" />
      </el-form-item>

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
import ImageUpload from '@/components/ImageUpload.vue'
import MultiImageUpload from '@/components/MultiImageUpload.vue'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const submitting = ref(false)

const isEdit = ref(false)
const editId = ref<number | null>(null)

const form = reactive({
  name: '',
  category: '',
  summary: '',
  description: '',
  priceRef: 0,
  unit: '',
  coverImage: '',
  images: '[]',
  isFeatured: false,
  sortOrder: 0,
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
}

async function loadProduct(id: number) {
  try {
    const res = await request.get(`/admin/products/${id}`)
    if (res) {
      form.name = res.name
      form.category = res.category
      form.summary = res.summary ?? ''
      form.description = res.description ?? ''
      form.priceRef = res.priceRef
      form.unit = res.unit ?? ''
      form.coverImage = res.coverImage ?? ''
      form.images = res.images ?? '[]'
      form.isFeatured = res.isFeatured === 1
      form.sortOrder = res.sortOrder
    }
  } catch {
    ElMessage.error('获取产品信息失败')
  }
}

async function handleSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const data = {
      ...form,
      isFeatured: form.isFeatured ? 1 : 0,
    }
    if (isEdit.value && editId.value) {
      await request.put(`/admin/products/${editId.value}`, data)
      ElMessage.success('更新成功')
    } else {
      await request.post('/admin/products', data)
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
    loadProduct(editId.value)
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
