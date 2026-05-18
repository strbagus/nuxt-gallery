<script setup>
const props = defineProps(['menus'])
</script>
<template>
  <li v-for="m in props.menus" :key="m.path || m.title">
    <template v-if="m.sub">
      <details close>
        <summary>
          <component :is="m.icon" :size="16" /><span>&nbsp;{{ m.title }}</span>
        </summary>
        <ul>
          <SideMenu :menus="m.sub" />
        </ul>
      </details>

    </template>
    <template v-else>
      <NuxtLink :to="m.path">
        <component :is="m.icon" :size="16" />
        <span>{{ m.title }}</span>
      </NuxtLink>
    </template>
  </li>
</template>
