import { writable } from 'svelte/store'

// Toast types
export type ToastType = 'info' | 'success' | 'warning' | 'error'

// Toast interface
export interface Toast {
  id: string
  message: string
  type: ToastType
  timeout: number
}

// Create a writable store for toasts
export const toasts = writable<Toast[]>([])

// No initialization needed - toasts will be added by the notification system

// Add a toast
export function addToast(message: string, type: ToastType = 'info', timeout: number = 5000) {
  const id = crypto.randomUUID()
  
  // Debug logging
  console.log('Toast created:', { id, message, type, timeout })
  
  // Add the toast to the store
  toasts.update(all => [{ id, message, type, timeout }, ...all])
  
  // Automatically remove the toast after the specified timeout
  if (timeout > 0) {
    setTimeout(() => {
      dismissToast(id)
    }, timeout)
  }
  
  return id
}

// Remove a specific toast by ID
export function dismissToast(id: string) {
  toasts.update(all => all.filter(t => t.id !== id))
}

// Remove all toasts
export function clearToasts() {
  toasts.set([])
}
