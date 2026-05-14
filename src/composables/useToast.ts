import { ref } from 'vue'

const toasts = ref([])

export function useToast() {
  /**
   * @param {string} message - The text to display
   * @param {'success' | 'error' | 'warning' | 'info'} type - daisyUI alert class
   * @param {number} duration - Time in ms
   */
  const addToast = (message: string, type: string = 'info', duration: number = 3000) => {
    const id = Date.now()
    const toast = { id, message, type }

    toasts.value.push(toast)

    // Auto-remove after duration
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    toasts,
    addToast,
    removeToast,
    // Shorthands for cleaner code
    success: (msg: string) => addToast(msg, 'success'),
    error: (msg: string) => addToast(msg, 'error'),
  }
}
