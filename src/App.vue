<script setup>
import { RouterView } from 'vue-router';
import { onMounted } from 'vue'
import { useTheme } from './composables/useTheme';
const { initTheme } = useTheme()
onMounted(() => {
  initTheme
})
</script>

<template>
  <component :is="$route.meta.layout || 'div'">
    <RouterView />
  </component>
</template>

<style scoped></style>
