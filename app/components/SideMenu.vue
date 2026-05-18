<script setup lang="ts">
interface Menu {
  title: string;
  icon?: string;
  path?: string;
  sub?: Menu[];
}

const props = defineProps<{
  menus: Menu[]
}>()
</script>
<template>
  <li v-for="m in props.menus" :key="m.path || m.title">
    <template v-if="m.sub">
      <details close>
        <summary>
          <Icon v-if="m.icon" :name="m.icon" size="16" /><span>&nbsp;{{ m.title }}</span>
        </summary>
        <ul>
          <SideMenu :menus="m.sub" />
        </ul>
      </details>

    </template>
    <template v-else>
      <NuxtLink v-if="m.path" :to="m.path">
        <Icon v-if="m.icon" :name="m.icon" size="16" />
        <span>{{ m.title }}</span>
      </NuxtLink>
    </template>
  </li>
</template>
