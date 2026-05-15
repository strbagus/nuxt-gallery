<script setup lang="ts">
import { usePageMeta } from '@/composables/usePageMeta';
import { onMounted } from 'vue';

const { setPageMeta } = usePageMeta()
onMounted(() => {
  setPageMeta('Settings')
})
</script>
<template>
  <div class="p-4 bg-base-200 rounded-lg shadow-sm">
    <p class="text-base-content/70 italic">Application settings will appear here.</p>
  </div>
</template>
