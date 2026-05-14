<script setup>
import { RouterView } from 'vue-router';
import { onMounted } from 'vue'
import { useTheme } from './composables/useTheme';
import ToastContainer from './components/ToastContainer.vue';
import ConfirmDialog from './components/ConfirmDialog.vue';
const { initTheme } = useTheme()
onMounted(() => {
  initTheme
})
</script>

<template>
  <component :is="$route.meta.layout || 'div'">
    <RouterView />
    <ConfirmDialog />
    <ToastContainer />
  </component>
</template>

<style scoped></style>
