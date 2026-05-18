<script setup lang="ts">
interface Breadcrumb {
  label: string;
  href?: string;
}

const { breadcrumbs: manualBreadcrumbs } = usePageMeta()
const route = useRoute()

const breadcrumbs = computed<Breadcrumb[]>(() => {
  if (manualBreadcrumbs.value && manualBreadcrumbs.value.length > 0) return manualBreadcrumbs.value

  const pathNodes = route.path.split('/').filter(node => node !== '');

  const crumbs: Breadcrumb[] = [
    { label: 'home', href: '/admin' }
  ];

  let currentPath = '';
  pathNodes.forEach((node) => {
    const previousPath = currentPath;
    currentPath += `/${node}`;
    
    // Skip 'admin' node as it's already represented by 'home'
    if (node === 'admin' && previousPath === '') {
      return;
    }

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
      <li v-for="(crumb, index) in breadcrumbs" :key="crumb.href || crumb.label">
        <NuxtLink v-if="crumb.href && index < breadcrumbs.length - 1" :to="crumb.href"
          class="opacity-60 hover:opacity-100 transition-opacity">
          {{ crumb.label }}
        </NuxtLink>
        <span v-else class="text-base-content pointer-events-none">
          {{ crumb.label }}
        </span>
      </li>
    </ul>
  </div>
</template>
