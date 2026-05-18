const isOpen = ref(false)
const options = ref({
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  type: 'primary' // primary, error, warning
})

let resolvePromise: (value: boolean) => void

export function useConfirm() {
  const ask = (config: Partial<typeof options.value> = {}) => {
    // Merge custom config with defaults
    options.value = { ...options.value, ...config }
    isOpen.value = true

    return new Promise<boolean>((resolve) => {
      resolvePromise = resolve
    })
  }

  const confirm = () => {
    isOpen.value = false
    if (resolvePromise) resolvePromise(true)
  }

  const cancel = () => {
    isOpen.value = false
    if (resolvePromise) resolvePromise(false)
  }

  return { isOpen, options, ask, confirm, cancel }
}
