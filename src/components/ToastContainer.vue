<script setup>
import { useToast } from '@/composables/useToast'
const { toasts, removeToast } = useToast()
</script>

<template>
  <div class="toast toast-end toast-top z-100">
    <TransitionGroup enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-x-full opacity-0" enter-to-class="transform translate-x-0 opacity-100"
      leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-for="toast in toasts" :key="toast.id" :class="['alert shadow-lg', {
        'alert-success': toast.type === 'success',
        'alert-error': toast.type === 'error',
        'alert-info': toast.type === 'info',
        'alert-warning': toast.type === 'warning',
      }]">
        <span class="text-sm font-medium">{{ toast.message }}</span>
        <button @click="removeToast(toast.id)" class="btn btn-ghost btn-xs">✕</button>
      </div>
    </TransitionGroup>
  </div>
</template>
