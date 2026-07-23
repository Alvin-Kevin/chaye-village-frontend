<template>
  <div class="banners-page">
    <div class="toolbar">
      <h2 class="page-title">Banner管理</h2>
      <el-button type="primary" @click="openCreate">新增Banner</el-button>
    </div>

    <el-table :data="list" v-loading="loading" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="title" label="标题" min-width="120" />
      <el-table-column prop="subtitle" label="副标题" min-width="150" />
      <el-table-column prop="sortOrder" label="排序" width="80" align="center" />
      <el-table-column label="状态" width="80" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template #default="{ row }">
          <el-button size="small" type="primary" link @click="openEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑Banner' : '新增Banner'"
      width="520px"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="副标题" prop="subtitle">
          <el-input v-model="form.subtitle" placeholder="请输入副标题" />
        </el-form-item>
        <el-form-item label="图片" prop="imageUrl">
          <ImageUpload v-model="form.imageUrl" />
        </el-form-item>
        <el-form-item label="链接地址" prop="linkUrl">
          <el-input v-model="form.linkUrl" placeholder="请输入链接URL" />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="form.sortOrder" :min="0" />
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
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { Banner } from '@/types'
import request from '@/api/request'
import ImageUpload from '@/components/ImageUpload.vue'

const list = ref<Banner[]>([])
const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref<number | null>(null)
const formRef = ref<FormInstance>()

const form = reactive({
  title: '',
  subtitle: '',
  imageUrl: '',
  linkUrl: '',
  sortOrder: 0,
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  imageUrl: [{ required: true, message: '请输入图片地址', trigger: 'blur' }],
}

async function fetchList() {
  loading.value = true
  try {
    const res = await request.get('/admin/banners')
    list.value = res?.records ?? []
  } catch {
    ElMessage.error('获取Banner列表失败')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  isEdit.value = false
  editId.value = null
  dialogVisible.value = true
}

function openEdit(row: Banner) {
  isEdit.value = true
  editId.value = row.id
  form.title = row.title
  form.subtitle = row.subtitle ?? ''
  form.imageUrl = row.imageUrl
  form.linkUrl = row.linkUrl ?? ''
  form.sortOrder = row.sortOrder
  dialogVisible.value = true
}

function resetForm() {
  formRef.value?.resetFields()
  form.title = ''
  form.subtitle = ''
  form.imageUrl = ''
  form.linkUrl = ''
  form.sortOrder = 0
}

async function handleSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    if (isEdit.value && editId.value) {
      await request.put(`/admin/banners/${editId.value}`, form)
      ElMessage.success('更新成功')
    } else {
      await request.post('/admin/banners', form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    fetchList()
  } catch {
    ElMessage.error('操作失败')
  } finally {
    submitting.value = false
  }
}

async function handleDelete(row: Banner) {
  try {
    await ElMessageBox.confirm(`确认删除Banner "${row.title}"？`, '删除确认', {
      type: 'warning',
    })
    await request.delete(`/admin/banners/${row.id}`)
    ElMessage.success('删除成功')
    fetchList()
  } catch {
    // user cancelled
  }
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="scss">
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-title {
  font-size: 20px;
  color: #333;
  margin: 0;
}
</style>
