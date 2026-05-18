<script setup>
useHead({
  htmlAttrs: {
    lang: 'en',
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
