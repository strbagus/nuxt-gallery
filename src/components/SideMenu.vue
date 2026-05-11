<script setup>
import SideMenu from '@/components/SideMenu.vue';
const props = defineProps(['menus'])
</script>
<template>
  <li v-for="m in props.menus">
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
      <RouterLink :to="m.path">
        <component :is="m.icon" :size="16" />
        <span>{{ m.title }}</span>
      </RouterLink>
    </template>
  </li>
</template>
