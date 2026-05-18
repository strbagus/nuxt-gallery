<script setup>
const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/admin' })
</script>

<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center bg-base-100 text-base-content">
    <div class="text-3xl font-bold flex items-center mb-8">
      <span class="text-accent text-5xl">{{ error?.statusCode || '404' }}</span>
      <div class="w-1 h-12 mx-4 bg-base-content/20"></div>
      <span>{{ error?.statusMessage || 'NOT FOUND' }}</span>
    </div>
    <button @click="handleError" class="btn btn-primary">
      Go back to Dashboard
    </button>
  </div>
</template>
