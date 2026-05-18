<script setup>
useHead({
  htmlAttrs: {
    'data-theme': 'dark',
    class: 'dark'
  }
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ConfirmDialog />
  <ToastContainer />
</template>
