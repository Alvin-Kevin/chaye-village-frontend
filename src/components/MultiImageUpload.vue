<template>
  <div class="multi-image-upload">
    <div class="image-grid">
      <div v-for="(url, index) in imageList" :key="index" class="image-item">
        <img :src="url" class="thumb" />
        <div class="image-mask" @click="removeImage(index)">
          <el-icon :size="18"><Close /></el-icon>
        </div>
      </div>
      <div v-if="imageList.length < 6" class="upload-box">
        <el-upload
          :action="uploadUrl"
          :headers="uploadHeaders"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :on-success="onSuccess"
          :on-error="onError"
          accept="image/*"
          name="file"
        >
          <div class="upload-trigger">
            <el-icon :size="24"><Plus /></el-icon>
            <span>添加图片</span>
          </div>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Close, Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const uploadUrl = '/api/v1/common/upload'

const uploadHeaders = computed(() => {
  const token = localStorage.getItem('admin_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
})

const imageList = computed(() => {
  if (!props.modelValue) return []
  try {
    const arr = JSON.parse(props.modelValue)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
})

function updateImages(arr: string[]) {
  emit('update:modelValue', JSON.stringify(arr))
}

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
    updateImages([...imageList.value, response.data.url])
    ElMessage.success('上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

const onError: UploadProps['onError'] = () => {
  ElMessage.error('上传失败，请检查网络')
}

function removeImage(index: number) {
  const arr = [...imageList.value]
  arr.splice(index, 1)
  updateImages(arr)
}
</script>

<style scoped lang="scss">
.multi-image-upload {
  .image-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .image-item {
    width: 120px;
    height: 90px;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    border: 1px solid #dcdfe6;

    .thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-mask {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s;
    }

    &:hover .image-mask {
      opacity: 1;
    }
  }

  .upload-box {
    width: 120px;
    height: 90px;
    border: 2px dashed #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
    transition: border-color 0.3s;

    &:hover {
      border-color: #409eff;
    }
  }

  .upload-trigger {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: #999;
    font-size: 13px;
  }
}
</style>
