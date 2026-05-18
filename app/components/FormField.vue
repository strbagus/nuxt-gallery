<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  id: {
    type: String,
    default: () => `field-${Math.random().toString(36).substring(2, 9)}`
  },
  hint: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  }
})

const hasError = computed(() => !!props.error)
</script>

<template>
  <div class="form-control w-full">
    <label :for="id" class="label">
      <span class="label-text font-semibold">
        {{ label }}
        <span v-if="required" class="text-error">*</span>
      </span>
    </label>

    <!-- Default slot for input/select/textarea -->
    <slot :id="id" :is-error="hasError" />

    <!-- Error Message -->
    <label v-if="error" class="label py-1">
      <span class="label-text-alt text-error font-medium">{{ error }}</span>
    </label>

    <!-- Hint/Info Message -->
    <label v-if="hint && !error" class="label py-1">
      <span class="label-text-alt opacity-60">{{ hint }}</span>
    </label>
  </div>
</template>
