<script setup lang="ts">
interface ErrorProps {
  error: {
    statusCode?: number | string;
    statusMessage?: string;
  };
}

const props = defineProps<ErrorProps>()

const handleError = () => clearError({ redirect: '/admin' })
</script>

<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center bg-base-100 text-base-content">
    <div class="text-3xl font-bold flex items-center mb-8">
      <span class="text-accent text-5xl">{{ props.error?.statusCode || '404' }}</span>
      <div class="w-1 h-12 mx-4 bg-base-content/20" />
      <span>{{ props.error?.statusMessage || 'NOT FOUND' }}</span>
    </div>
    <button class="btn btn-primary" @click="handleError">
      Go back to Dashboard
    </button>
  </div>
</template>
