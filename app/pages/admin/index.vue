<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const { setPageMeta } = usePageMeta()
onMounted(() => {
  setPageMeta('Dashboard')
})
</script>
<template>
  <div class="flex flex-wrap">
    <div class="w-1/4 p-3">
      <NuxtLink to="/admin/template" class="w-full bg-base-200 p-5 flex items-center shadow-lg">
        <div>
          <Icon name="lucide:database" size="84" />
        </div>
        <div class="pl-5 font-semibold text-xl">Total Data: 62</div>
      </NuxtLink>
    </div>
  </div>
</template>
