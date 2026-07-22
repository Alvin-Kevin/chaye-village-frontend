<template>
  <div class="village-info-page">
    <h2 class="page-title">村庄介绍编辑</h2>

    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="村情简介" name="intro">
        <div class="tab-content">
          <el-form label-width="80px">
            <el-form-item label="标题">
              <el-input v-model="sections.intro.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="内容">
              <el-input
                v-model="sections.intro.content"
                type="textarea"
                :rows="12"
                placeholder="请输入内容"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="saving" @click="saveSection('intro')">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <el-tab-pane label="地理环境" name="geography">
        <div class="tab-content">
          <el-form label-width="80px">
            <el-form-item label="标题">
              <el-input v-model="sections.geography.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="内容">
              <el-input
                v-model="sections.geography.content"
                type="textarea"
                :rows="12"
                placeholder="请输入内容"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="saving" @click="saveSection('geography')">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <el-tab-pane label="彝族文化" name="culture">
        <div class="tab-content">
          <el-form label-width="80px">
            <el-form-item label="标题">
              <el-input v-model="sections.culture.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="内容">
              <el-input
                v-model="sections.culture.content"
                type="textarea"
                :rows="12"
                placeholder="请输入内容"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="saving" @click="saveSection('culture')">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <el-tab-pane label="特色产业" name="industry">
        <div class="tab-content">
          <el-form label-width="80px">
            <el-form-item label="标题">
              <el-input v-model="sections.industry.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="内容">
              <el-input
                v-model="sections.industry.content"
                type="textarea"
                :rows="12"
                placeholder="请输入内容"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="saving" @click="saveSection('industry')">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { VillageInfo } from '@/types'
import request from '@/api/request'

const activeTab = ref('intro')
const saving = ref(false)

const sections = reactive<Record<string, { id: number | null; title: string; content: string }>>({
  intro: { id: null, title: '', content: '' },
  geography: { id: null, title: '', content: '' },
  culture: { id: null, title: '', content: '' },
  industry: { id: null, title: '', content: '' },
})

async function loadSection(section: string) {
  try {
    const res = await request.get(`/admin/village-info/${section}`)
    if (res) {
      sections[section].id = res.id
      sections[section].title = res.title ?? ''
      sections[section].content = res.content ?? ''
    }
  } catch {
    // section may not exist yet
  }
}

async function handleTabChange(name: string) {
  loadSection(name)
}

async function saveSection(section: string) {
  saving.value = true
  try {
    const data = sections[section]
    if (data.id) {
      await request.put(`/admin/village-info/${section}`, {
        title: data.title,
        content: data.content,
      })
    } else {
      await request.post('/admin/village-info', {
        section,
        title: data.title,
        content: data.content,
      })
    }
    ElMessage.success('保存成功')
  } catch {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadSection('intro')
})
</script>

<style scoped lang="scss">
.page-title {
  font-size: 20px;
  color: #333;
  margin-bottom: 16px;
}

.tab-content {
  padding-top: 16px;
  max-width: 800px;
}
</style>
