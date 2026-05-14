<script setup>
import { useConfirm } from '@/composables/useConfirm'
const { isOpen, options, confirm, cancel } = useConfirm()
</script>

<template>
  <div :class="['modal', { 'modal-open': isOpen }]">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ options.title }}</h3>
      <p class="py-4">{{ options.message }}</p>

      <div class="modal-action">
        <button class="btn btn-ghost" @click="cancel">
          {{ options.cancelText }}
        </button>
        <button :class="['btn', {
          'btn-primary': options.type === 'primary',
          'btn-error': options.type === 'error',
          'btn-warning': options.type === 'warning'
        }]" @click="confirm">
          {{ options.confirmText }}
        </button>
      </div>
    </div>
    <!-- Click outside to close (optional) -->
    <div class="modal-backdrop" @click="cancel"></div>
  </div>
</template>
