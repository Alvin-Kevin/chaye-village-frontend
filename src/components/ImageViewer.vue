<template>
  <Teleport to="body">
    <div v-if="visible" class="viewer-overlay" @click.self="$emit('close')">
      <div class="viewer-toolbar">
        <span v-if="images.length > 1" class="counter">{{ current + 1 }} / {{ images.length }}</span>
        <el-icon class="close-btn" :size="28" @click="$emit('close')"><Close /></el-icon>
      </div>
      <div class="viewer-body">
        <el-icon v-if="images.length > 1" class="nav-arrow left" :size="44" @click.stop="prev"><ArrowLeft /></el-icon>
        <img :src="images[current]" class="viewer-img" @click.stop />
        <el-icon v-if="images.length > 1" class="nav-arrow right" :size="44" @click.stop="next"><ArrowRight /></el-icon>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Close, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const props = defineProps<{
  visible: boolean
  images: string[]
  initialIndex?: number
}>()

const emit = defineEmits<{
  close: []
}>()

const current = ref(0)

watch(() => props.visible, (val) => {
  if (val) current.value = props.initialIndex ?? 0
})

function prev() {
  current.value = current.value > 0 ? current.value - 1 : props.images.length - 1
}

function next() {
  current.value = current.value < props.images.length - 1 ? current.value + 1 : 0
}

function onKeydown(e: KeyboardEvent) {
  if (!props.visible) return
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped lang="scss">
.viewer-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.viewer-toolbar {
  position: absolute;
  top: 0; left: 0; right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 24px;
  color: #fff;

  .counter {
    font-size: 15px;
    opacity: 0.85;
  }

  .close-btn {
    position: absolute;
    right: 24px;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.2s;
    &:hover { opacity: 1; }
  }
}

.viewer-body {
  display: flex;
  align-items: center;
  justify-content: center;

  .viewer-img {
    max-width: 90vw;
    max-height: 85vh;
    object-fit: contain;
    user-select: none;
    border-radius: 4px;
  }

  .nav-arrow {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    color: #fff;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));

    &:hover { opacity: 1; }

    &.left { left: 20px; }
    &.right { right: 20px; }

    @media (max-width: 768px) {
      &.left { left: 8px; }
      &.right { right: 8px; }
    }
  }
}
</style>
