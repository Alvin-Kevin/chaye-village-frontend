<template>
  <div class="frontend-layout">
    <header class="navbar">
      <div class="navbar-inner">
        <router-link to="/" class="logo">
          <span class="logo-icon">🍃</span>
          <span class="logo-text">马边茶叶村</span>
        </router-link>
        <nav class="nav-menu">
          <router-link to="/" class="nav-item" exact-active-class="active" active-class="">首页</router-link>
          <router-link to="/village" class="nav-item" active-class="active">村庄概况</router-link>
          <router-link to="/products" class="nav-item" active-class="active">茶叶特产</router-link>
          <router-link to="/spots" class="nav-item" active-class="active">文旅景点</router-link>
          <router-link to="/yi-culture" class="nav-item" active-class="active">彝文化</router-link>
          <router-link to="/articles" class="nav-item" active-class="active">新闻资讯</router-link>
          <router-link to="/dashboard" class="nav-item" active-class="active">数据大屏</router-link>
        </nav>
      </div>
    </header>
    <main class="main-content">
      <router-view />
    </main>
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-info">
          <h4>马边彝族自治县茶叶村</h4>
          <p>四川省乐山市马边彝族自治县</p>
          <p>乡村振兴数字展示与管理平台</p>
        </div>
        <div class="footer-copy">
          <p>© 2026 暑期社会实践项目 · 茶叶村</p>
          <p>基于实地调研数据 · 助力乡村振兴</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.frontend-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  .logo-icon { font-size: 28px; }
  .logo-text { font-size: 20px; font-weight: 700; color: #1A1A1A; }
}

.nav-menu {
  display: flex;
  gap: 4px;
}

.nav-item {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 15px;
  color: #666;
  transition: all 0.2s;
  &:hover, &.active {
    color: #C41E1E;
    background: rgba(196, 30, 30, 0.06);
  }
}

.main-content {
  flex: 1;
}

.footer {
  background: #1A1A1A;
  color: #ccc;
  padding: 40px 0 24px;
  margin-top: 60px;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.footer-info {
  h4 { color: #FFD700; margin-bottom: 8px; font-size: 18px; }
  p { font-size: 14px; line-height: 1.8; }
}

.footer-copy {
  text-align: right;
  p { font-size: 13px; line-height: 1.8; }
}

@media (max-width: 768px) {
  .nav-menu { display: none; }
  .footer-inner { flex-direction: column; gap: 20px; }
  .footer-copy { text-align: left; }
}
</style>
