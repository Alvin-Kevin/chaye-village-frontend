<template>
  <div class="image-upload">
    <el-upload
      :action="uploadUrl"
      :headers="headers"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      accept="image/*"
      name="file"
    >
      <img v-if="modelValue" :src="modelValue" class="preview-image" />
      <div v-else class="upload-placeholder">
        <el-icon><Plus /></el-icon>
        <span>点击上传图片</span>
      </div>
    </el-upload>
    <div v-if="modelValue" class="image-actions">
      <el-button size="small" type="primary" link @click="triggerUpload">更换图片</el-button>
      <el-button size="small" type="danger" link @click="handleRemove">移除图片</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const uploadUrl = '/api/v1/common/upload'

const headers = computed(() => {
  const token = localStorage.getItem('admin_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
})

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB')
    return false
  }
  return true
}

const onSuccess: UploadProps['onSuccess'] = (response: any) => {
  if (response.code === 200 && response.data?.url) {
    emit('update:modelValue', response.data.url)
    ElMessage.success('上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

const onError: UploadProps['onError'] = (err: any) => {
  if (err?.status === 413) {
    ElMessage.error('图片过大，请压缩后重试（不超过5MB）')
  } else if (err?.status === 401 || err?.status === 403) {
    ElMessage.error('登录过期，请重新登录')
  } else {
    ElMessage.error('上传失败: ' + (err?.message || '网络错误'))
  }
}

function triggerUpload() {
  const el = document.querySelector('.image-upload .el-upload') as HTMLElement
  el?.click()
}

function handleRemove() {
  emit('update:modelValue', '')
}
</script>

<style scoped lang="scss">
.image-upload {
  .preview-image {
    width: 200px;
    height: 133px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
  }

  .upload-placeholder {
    width: 200px;
    height: 133px;
    border: 2px dashed #dcdfe6;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #999;
    cursor: pointer;
    transition: border-color 0.3s;

    &:hover {
      border-color: #409eff;
    }
  }

  .image-actions {
    margin-top: 8px;
  }
}
</style>
