<script setup>
import { RouterLink } from 'vue-router';
</script>
<template>
  <div class="flex justify-between">
    <h1 class="text-2xl font-medium">Template Index</h1>
    <div class="breadcrumbs text-sm">
      <ul>
        <li>
          <RouterLink to="/">Home</RouterLink>
        </li>
        <li>
          <RouterLink to="/template">Template</RouterLink>
        </li>
        <li>Add Document</li>
      </ul>
    </div>
  </div>
</template>
