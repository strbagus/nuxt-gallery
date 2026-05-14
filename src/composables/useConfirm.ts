import { ref } from 'vue'

const isOpen = ref(false)
const options = ref({
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  type: 'primary' // primary, error, warning
})

let resolvePromise: any

export function useConfirm() {
  const ask = (config = {}) => {
    // Merge custom config with defaults
    options.value = { ...options.value, ...config }
    isOpen.value = true

    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  const confirm = () => {
    isOpen.value = false
    resolvePromise(true)
  }

  const cancel = () => {
    isOpen.value = false
    resolvePromise(false)
  }

  return { isOpen, options, ask, confirm, cancel }
}
