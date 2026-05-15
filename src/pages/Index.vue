<script setup lang="ts">
import { Database } from '@lucide/vue';
import { RouterLink } from 'vue-router';
</script>
<template>
  <div class="flex flex-wrap">
    <div class="w-1/4 p-3">
      <RouterLink to="/template" class="w-full bg-base-200 p-5 flex items-center shadow-lg">
        <div><Database :size="84" /></div>
        <div class="pl-5 font-semibold text-xl">Total Data: 62</div>
      </RouterLink>
    </div>
  </div>
</template>
