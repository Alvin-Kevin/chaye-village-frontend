<template>
  <div class="article-form-page">
    <h2 class="page-title">{{ isEdit ? '编辑文章' : '新增文章' }}</h2>

    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="form-wrap">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="分类" prop="categoryId">
            <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%">
              <el-option
                v-for="cat in categories"
                :key="cat.id"
                :label="cat.name"
                :value="cat.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作者" prop="author">
            <el-input v-model="form.author" placeholder="请输入作者" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入文章标题" />
      </el-form-item>

      <el-form-item label="摘要" prop="summary">
        <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="请输入文章摘要" />
      </el-form-item>

      <el-form-item label="内容" prop="content">
        <el-input v-model="form.content" type="textarea" :rows="10" placeholder="请输入文章内容" />
      </el-form-item>

      <el-form-item label="封面图片" prop="coverImage">
        <el-input v-model="form.coverImage" placeholder="请输入图片URL" />
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
import type { ArticleCategory } from '@/types'
import request from '@/api/request'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const submitting = ref(false)

const isEdit = ref(false)
const editId = ref<number | null>(null)
const categories = ref<ArticleCategory[]>([])

const form = reactive({
  categoryId: null as number | null,
  title: '',
  summary: '',
  content: '',
  coverImage: '',
  author: '',
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
}

async function fetchCategories() {
  try {
    const res = await request.get('/admin/articles/categories')
    categories.value = res ?? []
  } catch {
    // non-critical
  }
}

async function loadArticle(id: number) {
  try {
    const res = await request.get(`/admin/articles/${id}`)
    if (res) {
      form.categoryId = res.categoryId
      form.title = res.title
      form.summary = res.summary ?? ''
      form.content = res.content ?? ''
      form.coverImage = res.coverImage ?? ''
      form.author = res.author ?? ''
    }
  } catch {
    ElMessage.error('获取文章信息失败')
  }
}

async function handleSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    if (isEdit.value && editId.value) {
      await request.put(`/admin/articles/${editId.value}`, form)
      ElMessage.success('更新成功')
    } else {
      await request.post('/admin/articles', form)
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
  fetchCategories()
  const id = route.params.id
  if (id && typeof id === 'string') {
    isEdit.value = true
    editId.value = parseInt(id)
    loadArticle(editId.value)
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
