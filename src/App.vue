<script setup>
import { RouterView, useRoute } from 'vue-router';
// import SidebarLayout from './layouts/SidebarLayout.vue';
// import { computed } from 'vue';

/* const route = useRoute()

const layouts = {
  sidebar: SidebarLayout
} */

/* const layout = computed(() => {
  return layouts[route.meta.layout] || 'div'
}) */
</script>

<template>
  <!-- <component :is="layout">
    <RouterView :key="$route.fullPath" />
  </component> -->
  <RouterView v-slot="{ Component, route }">
    <component :is="route.meta.layout || 'div'">
      <KeepAlive>
        <component :is="Component" :key="route.fullPath" />
      </KeepAlive>
    </component>
  </RouterView>
</template>

<style scoped></style>
