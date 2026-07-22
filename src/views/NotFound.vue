<template>
  <div class="not-found">
    <h1>404</h1>
    <p>页面未找到</p>
    <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
  </div>
</template>

<style scoped>
.not-found { text-align: center; padding: 120px 20px; }
.not-found h1 { font-size: 80px; color: #C41E1E; }
.not-found p { font-size: 20px; color: #666; margin: 16px 0 32px; }
</style>
