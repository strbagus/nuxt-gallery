<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

interface Breadcrumb {
  label: string;
  href: string;
}

const route = useRoute()

const breadcrumbs = computed<Breadcrumb[]>(() => {
  const pathNodes = route.path.split('/').filter(node => node !== '');

  const crumbs: Breadcrumb[] = [
    { label: 'home', href: '/' }
  ];

  let currentPath = '';
  pathNodes.forEach((node) => {
    currentPath += `/${node}`;
    crumbs.push({
      label: node.replace(/[-_]/g, ' '),
      href: currentPath
    });
  });

  return crumbs;
});
</script>

<template>
  <div class="breadcrumbs text-sm font-semibold capitalize my-4">
    <ul>
      <li v-for="(crumb, index) in breadcrumbs" :key="crumb.href">
        <RouterLink v-if="index < breadcrumbs.length - 1" :to="crumb.href"
          class="opacity-60 hover:opacity-100 transition-opacity">
          {{ crumb.label }}
        </RouterLink>
        <span v-else class="text-base-content pointer-events-none">
          {{ crumb.label }}
        </span>
      </li>
    </ul>
  </div>
</template>
